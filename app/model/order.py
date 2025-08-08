from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base
import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    orderId = Column(String, unique=True, index=True, nullable=False)
    orderDate = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Aguardando Pagamento")
    cpf = Column(String, nullable=True)
    totalPrice = Column(Float, nullable=False)

    # --- Detalhes do Pedido ---
    movieTitle = Column(String)
    movieImage = Column(String)
    cinemaName = Column(String)
    sessionTime = Column(String)
    
    # --- Armazenamento de dados complexos como JSON ---
    selectedSeats = Column(JSON) # Lista de dicionários de assentos
    ticketOrder = Column(JSON) # Lista de dicionários de tipos de bilhete
    bomboniereOrder = Column(JSON) # Lista de dicionários de itens da bomboniere

    # --- Chaves Estrangeiras ---
    user_id = Column(Integer, ForeignKey("users.id"))
    cinema_id = Column(Integer, ForeignKey("cinemas.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))

    # --- Relações ---
    user = relationship("User")
    cinema = relationship("Cinema")
    session = relationship("Session")
