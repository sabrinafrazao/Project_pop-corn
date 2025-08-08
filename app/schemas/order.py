from pydantic import BaseModel
from typing import List, Any, Dict
import datetime

# --- Schemas para os itens dentro do pedido ---
class SeatSchema(BaseModel):
    id: str
    status: str

class TicketOrderItemSchema(BaseModel):
    ticketType: Dict[str, Any]
    quantity: int

class BomboniereOrderItemSchema(BaseModel):
    product: Dict[str, Any]
    quantity: int

# --- Schema para criar um novo Pedido ---
class OrderCreate(BaseModel):
    cpf: str
    totalPrice: float
    movieTitle: str
    movieImage: str
    cinemaName: str
    sessionTime: str
    selectedSeats: List[SeatSchema]
    ticketOrder: List[TicketOrderItemSchema]
    bomboniereOrder: List[BomboniereOrderItemSchema]
    
    # IDs para as relações
    cinema_id: int
    session_id: int

# --- Schema para ler/retornar um Pedido ---
class OrderRead(OrderCreate):
    id: int
    orderId: str
    orderDate: datetime.datetime
    status: str
    user_id: int

    class Config:
        from_attributes = True
