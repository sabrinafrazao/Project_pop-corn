# app/services/user_service.py
from sqlalchemy.orm import Session
from app.model.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.auth import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    """Busca um usuário pelo email."""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """Busca um usuário pelo ID."""
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    """Retorna todos os usuários."""
    return db.query(User).all()

def create_user(db: Session, user_data: UserCreate):
    """Cria um novo usuário no banco de dados com senha hasheada."""
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role,
        avatarUrl=user_data.avatarUrl
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_data: UserUpdate):
    """Atualiza os dados de um usuário."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    # Converte o schema Pydantic para um dicionário, excluindo campos não definidos
    update_data = user_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Deleta um usuário."""
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    db.delete(db_user)
    db.commit()
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    """Autentica um usuário, verificando email e senha."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user
