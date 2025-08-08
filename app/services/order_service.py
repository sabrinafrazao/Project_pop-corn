from sqlalchemy.orm import Session
from app.model.order import Order
from app.schemas.order import OrderCreate
from app.services import cinema_service # 1. Importar o serviço de cinema
import uuid

def create_order(db: Session, order_data: OrderCreate, user_id: int):
    """Cria um novo pedido no banco de dados."""
    
    order_uuid = f"PC-{uuid.uuid4().hex[:9].upper()}"
    selected_seats_json = [seat.model_dump() for seat in order_data.selectedSeats]
    ticket_order_json = [item.model_dump() for item in order_data.ticketOrder]
    bomboniere_order_json = [item.model_dump() for item in order_data.bomboniereOrder]

    db_order = Order(
        orderId=order_uuid,
        cpf=order_data.cpf,
        totalPrice=order_data.totalPrice,
        movieTitle=order_data.movieTitle,
        movieImage=order_data.movieImage,
        cinemaName=order_data.cinemaName,
        sessionTime=order_data.sessionTime,
        selectedSeats=selected_seats_json,
        ticketOrder=ticket_order_json,
        bomboniereOrder=bomboniere_order_json,
        user_id=user_id,
        cinema_id=order_data.cinema_id,
        session_id=order_data.session_id
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # --- LÓGICA ADICIONADA ---
    # Após o pedido ser criado, atualiza o status dos assentos na sessão
    seat_ids_to_occupy = [seat.id for seat in order_data.selectedSeats]
    cinema_service.update_seat_status_for_session(
        db=db, 
        session_id=order_data.session_id, 
        seat_ids=seat_ids_to_occupy
    )
    # -------------------------

    return db_order

def get_orders_by_user(db: Session, user_id: int):
    """Retorna todos os pedidos de um utilizador específico."""
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.orderDate.desc()).all()
