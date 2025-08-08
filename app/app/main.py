from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as auth_router
from app.api.user_routes import router as user_router
from app.api.movie_routes import router as movie_router
from app.api.cinema_routes import router as cinema_router
from app.api.order_routes import router as order_router
from app.api.bomboniere_routes import router as bomboniere_router # 1. Importar
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pop&Corn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=auth_router, prefix="/api")
app.include_router(router=user_router, prefix="/api")
app.include_router(router=movie_router, prefix="/api")
app.include_router(router=cinema_router, prefix="/api")
app.include_router(router=order_router, prefix="/api")
app.include_router(router=bomboniere_router, prefix="/api") # 2. Incluir

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API Pop&Corn"}
