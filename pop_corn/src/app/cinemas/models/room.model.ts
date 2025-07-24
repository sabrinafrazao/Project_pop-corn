import { Session } from "./session.model";

export interface Room {
    id: number;
    name: string; // Ex: "Sala 1"
    type: '2D' | '3D';
    sound: 'Dublado' | 'Legendado';
    technology?: 'Dolby Atmos' | 'XPlus'; // O '?' torna a propriedade opcional
    sessions: Session[];  
}