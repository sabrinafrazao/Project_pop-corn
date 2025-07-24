import { Seat } from "./seat.model";

export interface Session {
    id: number;
    movieId: number; //chave estrangeira de filme
    time: string; // horário "13:45"
    seatMap: Seat[][]; //  mapa de lugares
}