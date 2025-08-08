
import os
from app.db.database import Sessionlocal, engine, Base
from app.model.movie import Movie
from app.model.user import User
from app.model.cinema import Cinema, Room, Session 
from app.core.auth import get_password_hash
from app.model.bomboniere import BomboniereProduct

# --- DADOS PARA POPULAR O BANCO ---

movies_to_seed = [
    {
        "id": 1,
        "title": 'John Wick 4',
        "image": 'assets/images/johnWick.png',
        "genre": 'Ação, Suspense, Drama',
        "duration": '2h49min',
        "rating": 4.7,
        "ageRating": '18',
        "synopsis": 'John Wick enfrenta os líderes do submundo em uma batalha pela liberdade, com lutas intensas e muita ação do início ao fim.'
    },
    {
        "id": 2,
        "title": 'Vingadores: Guerra Infinita',
        "image": 'assets/images/avengers.png',
        "genre": 'Ação, Ficção, Super-herói',
        "duration": '2h40min',
        "rating": 4.8,
        "ageRating": '12',
        "synopsis": 'Os Vingadores unem forças com os Guardiões da Galáxia para impedir que Thanos reúna as Joias do Infinito e destrua metade do universo.'
    },
    {
        "id": 3,
        "title": 'É Assim Que Acaba',
        "image": 'assets/images/queAcaba.png',
        "genre": 'Romance, Drama',
        "duration": '2h03min',
        "rating": 4.6,
        "ageRating": '16',
        "synopsis": 'Baseado no best-seller de Colleen Hoover, a história acompanha Lily Bloom enquanto ela lida com relacionamentos marcados por amor e trauma.'
    },
    {
        "id": 4,
        "title": 'Deadpool & Wolverine',
        "image": 'assets/images/deadpool.png',
        "genre": 'Ação, Comédia, Super-herói',
        "duration": '2h15min',
        "rating": 4.9,
        "ageRating": '18',
        "synopsis": 'Deadpool retorna em uma aventura cheia de humor ácido e violência exagerada, agora ao lado do icônico Wolverine.'
    }
]

users_to_seed = [
    {
        "name": "Master Admin",
        "email": "master@popcorn.com",
        "password": get_password_hash("123456"),
        "role": "MASTER",
        "avatarUrl": "https://placehold.co/100x100/FFC800/000000?text=M"
    },
    {
        "name": "Cinema Admin",
        "email": "admin@popcorn.com",
        "password": get_password_hash("123456"),
        "role": "ADMIN",
        "avatarUrl": "https://placehold.co/100x100/4A5568/FFFFFF?text=A",
        "cinemaId": 1
    },
    {
        "name": "Usuário Comum",
        "email": "user@popcorn.com",
        "password": get_password_hash("123456"),
        "role": "USER",
        "avatarUrl": "https://placehold.co/100x100/FFFFFF/000000?text=U"
    }
]

bomboniere_to_seed = [
    {"id": 1, "name": 'Pipoca Pequena', "description": 'A porção ideal de pipoca com manteiga para um lanche rápido.', "price": 18.00, "image": 'assets/images/Pipoca_pequena.png'},
    {"id": 2, "name": 'Pipoca Média', "description": 'Pipoca na medida certa para acompanhar o seu filme.', "price": 22.00, "image": 'assets/images/Pipoca_media.png'},
    {"id": 3, "name": 'Pipoca Grande', "description": 'Uma porção generosa da nossa pipoca especial com manteiga.', "price": 26.00, "image": 'assets/images/Pipoca_grande.png'},
    {"id": 5, "name": 'Refrigerante em Copo', "description": '500ml do seu refrigerante preferido para refrescar.', "price": 12.00, "image": 'assets/images/refri-copo.png'},
    {"id": 6, "name": 'Refrigerante em Lata', "description": 'A opção clássica e gelada em lata de 350ml.', "price": 9.00, "image": 'assets/images/refri_lata.png'}
]

cinemas_to_seed = [
    {
        "name": "Centerplex - Grande Circular",
        "rooms": [
            {
                "name": "Sala 1", "type": "3D", "sound": "Dublado", "technology": "Dolby Atmos",
                "sessions": [
                    {"time": "20:00", "movie_id": 1},
                    {"time": "22:45", "movie_id": 1},
                    {"time": "17:00", "movie_id": 4}
                ]
            },
            {
                "name": "Sala 2", "type": "2D", "sound": "Dublado",
                "sessions": [
                    {"time": "16:30", "movie_id": 2},
                    {"time": "19:00", "movie_id": 3}
                ]
            }
        ]
    },
    {
        "name": "Cinépolis - Ponta Negra",
        "rooms": [
            {
                "name": "Sala IMAX", "type": "3D", "sound": "Legendado", "technology": "XPlus",
                "sessions": [
                    {"time": "18:00", "movie_id": 2},
                    {"time": "21:30", "movie_id": 2}
                ]
            },
            {
                "name": "Sala 3", "type": "2D", "sound": "Dublado",
                "sessions": [
                    {"time": "19:15", "movie_id": 3},
                    {"time": "22:00", "movie_id": 4}
                ]
            }
        ]
    }
]

# --- FUNÇÃO HELPER PARA GERAR MAPA DE LUGARES ---
def _generate_seat_map(rows: int = 8, cols: int = 12):
    seat_map = []
    for i in range(rows):
        row = []
        row_char = chr(ord('A') + i)
        for j in range(cols):
            seat = {"id": f"{row_char}{j + 1}", "status": "available"}
            row.append(seat)
        seat_map.append(row)
    return seat_map

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = Sessionlocal()

    try:
        if db.query(Movie).count() == 0:
            print("Populando banco de dados com filmes...")
            for movie_data in movies_to_seed:
                db.add(Movie(**movie_data))
            db.commit()
            print("Filmes inseridos com sucesso!")
        else:
            print("Banco de dados de filmes já populado.")

        if db.query(User).count() == 0:
            print("Populando banco de dados com utilizadores...")
            for user_data in users_to_seed:
                db.add(User(**user_data))
            db.commit()
            print("Utilizadores inseridos com sucesso!")
        else:
            print("Banco de dados de utilizadores já populado.")

        if db.query(Cinema).count() == 0:
            print("Populando banco de dados com cinemas...")
            for cinema_data in cinemas_to_seed:
                new_cinema = Cinema(name=cinema_data["name"])
                db.add(new_cinema)
                db.flush()

                for room_data in cinema_data["rooms"]:
                    new_room = Room(
                        name=room_data["name"], type=room_data["type"],
                        sound=room_data["sound"], technology=room_data.get("technology"),
                        cinema_id=new_cinema.id
                    )
                    db.add(new_room)
                    db.flush()

                    for session_data in room_data["sessions"]:
                        # --- CORREÇÃO AQUI ---
                        # Agora geramos e incluímos o mapa de lugares
                        new_session = Session(
                            time=session_data["time"], 
                            movie_id=session_data["movie_id"],
                            room_id=new_room.id,
                            seatMap=_generate_seat_map() # Adiciona o mapa de lugares
                        )
                        db.add(new_session)
            db.commit()
            print("Cinemas, salas e sessões inseridos com sucesso!")
        else:
            print("Banco de dados de cinemas já populado.")
        
        if db.query(BomboniereProduct).count() == 0:
            print("Populando banco de dados com produtos da bomboniere...")
            for product_data in bomboniere_to_seed:
                db.add(BomboniereProduct(**product_data))
            db.commit()
            print("Produtos da bomboniere inseridos com sucesso!")
        else:
            print("Banco de dados da bomboniere já populado.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
