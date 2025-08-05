import { Injectable, signal, WritableSignal } from "@angular/core";
import { AbstractCinemaService } from "./abstract-cinema.service";
import { Cinema } from "../models/cinema.model";
import { Seat } from "../models/seat.model";
import { Session } from "../models/session.model";
import { Observable, of } from "rxjs";
import { OperationResult } from "../../models/operation-result.model";
import { cloneDeep } from 'lodash';
import { Room } from "../models/room.model";

@Injectable()
export class MockCinemaService extends AbstractCinemaService {
  
  // Este sinal representa a lista completa e estável de todos os cinemas e as suas salas.
  override cinemas: WritableSignal<Cinema[]> = signal([]);
  
  private _baseCinemas: Cinema[] = [];
  private _allSessions = new Map<number, Session>();

  constructor() {
    super();
    this._generateAllMockData();
    // Carrega a lista completa de cinemas e salas no sinal. NUNCA MAIS SERÁ ALTERADA POR 'loadSessionsByMovie'.
    this.cinemas.set(this._baseCinemas);
  }

  // ===== MÉTODO CORRIGIDO: Agora devolve um Observable<Cinema[]> filtrado =====
  override loadSessionsByMovie(movieId: number): Observable<Cinema[]> {
    console.log(`Buscando sessões para o filme com ID: ${movieId}`);
    
    // Clona a estrutura de cinemas para trabalhar numa cópia segura.
    const cinemasForMovie = cloneDeep(this._baseCinemas);

    // Itera para popular apenas as sessões do filme relevante.
    cinemasForMovie.forEach(cinema => {
      cinema.rooms.forEach(room => {
        // A lógica aqui é complexa, mas garante que as sessões corretas são atribuídas
        const originalRoom = this._baseCinemas.find(c => c.id === cinema.id)?.rooms.find(r => r.id === room.id);
        if (originalRoom) {
          room.sessions = originalRoom.sessions.filter(session => session.movieId === movieId);
        } else {
          room.sessions = [];
        }
      });
    });

    // Filtra para retornar apenas os cinemas que acabaram com sessões após o filtro.
    const finalCinemas = cinemasForMovie.filter(c => c.rooms.some(r => r.sessions.length > 0));
    
    return of(finalCinemas);
  }
  
  override getSessionDetails(sessionId: number): Observable<Session | undefined> {
    return of(this._allSessions.get(sessionId));
  }
  
  private _generateAllMockData(): void {
    this._generateSession(1011, 1, '20:00', 8, 12);
    this._generateSession(1012, 1, '22:45', 8, 12);
    this._generateSession(2011, 2, '18:00', 10, 15);
    this._generateSession(2012, 2, '21:30', 10, 15);
    this._generateSession(2021, 2, '19:15', 7, 10);
    
    this._baseCinemas = [
      {
        id: 1, name: 'Centerplex - Grande Circular', rooms: [
          { 
            id: 101, name: 'Sala 1', type: '3D', sound: 'Dublado', technology: 'Dolby Atmos', 
            sessions: [this._allSessions.get(1011)!, this._allSessions.get(1012)!] 
          },
        ]
      },
      {
        id: 2, name: 'Cinépolis - Ponta Negra', rooms: [
          { 
            id: 201, name: 'Sala IMAX', type: '3D', sound: 'Legendado', technology: 'XPlus', 
            sessions: [this._allSessions.get(2011)!, this._allSessions.get(2012)!] 
          },
          { 
            id: 202, name: 'Sala 3', type: '2D', sound: 'Dublado', 
            sessions: [this._allSessions.get(2021)!]
          }
        ]
      },
    ];
  }
  
  private _generateSession(id: number, movieId: number, time: string, rows: number, cols: number): Session {
    const session: Session = { id, movieId, time, seatMap: this._generateSeatMap(rows, cols) };
    this._allSessions.set(id, session);
    return session;
  }
  
  override addCinema(cinemaData: Omit<Cinema, 'id' | 'rooms'>): Observable<OperationResult> {
    const newCinema: Cinema = { ...cinemaData, id: Date.now(), rooms: [] };
    this._baseCinemas.push(newCinema);
    this.cinemas.set(this._baseCinemas);
    return of({ success: true, data: newCinema, status: 201 });
  }

  override updateCinema(cinema: Cinema): Observable<OperationResult> {
    const index = this._baseCinemas.findIndex(c => c.id === cinema.id);
    if (index > -1) {
      this._baseCinemas[index] = cinema;
      this.cinemas.set(cloneDeep(this._baseCinemas));
      return of({ success: true, data: cinema, status: 200 });
    }
    return of({ success: false, status: 404 });
  }

  override deleteCinema(cinemaId: number): Observable<OperationResult> {
    this._baseCinemas = this._baseCinemas.filter(c => c.id !== cinemaId);
    this.cinemas.set(this._baseCinemas);
    return of({ success: true, status: 200 });
  }

  override addRoom(cinemaId: number, roomData: Omit<Room, 'id' | 'sessions'>): Observable<OperationResult<Room>> {
    const cinema = this._baseCinemas.find(c => c.id === cinemaId);
    if (!cinema) return of({ success: false, status: 404 });
    const newRoom: Room = { ...roomData, id: Date.now(), sessions: [] };
    cinema.rooms.push(newRoom);
    this.cinemas.set(cloneDeep(this._baseCinemas));
    return of({ success: true, data: newRoom, status: 201 });
  }

  override deleteRoom(cinemaId: number, roomId: number): Observable<OperationResult<void>> {
    const cinema = this._baseCinemas.find(c => c.id === cinemaId);
    if (cinema) {
      cinema.rooms = cinema.rooms.filter(r => r.id !== roomId);
      this.cinemas.set(cloneDeep(this._baseCinemas));
      return of({ success: true, status: 200 });
    }
    return of({ success: false, status: 404 });
  }

  override addSession(cinemaId: number, roomId: number, sessionData: Omit<Session, 'id' | 'seatMap'>): Observable<OperationResult<Session>> {
    const newSession = this._generateSession(Date.now(), sessionData.movieId, sessionData.time, 8, 12);
    const cinema = this._baseCinemas.find(c => c.id === cinemaId);
    const room = cinema?.rooms.find(r => r.id === roomId);
    if (room) {
        room.sessions.push(newSession);
    }
    return of({ success: true, data: newSession, status: 201 });
  }
  
  override deleteSession(cinemaId: number, roomId: number, sessionId: number): Observable<OperationResult<void>> {
    this._allSessions.delete(sessionId);
    const cinema = this._baseCinemas.find(c => c.id === cinemaId);
    const room = cinema?.rooms.find(r => r.id === roomId);
    if (room) {
      room.sessions = room.sessions.filter(s => s.id !== sessionId);
      return of({ success: true, status: 200 });
    }
    return of({ success: false, status: 404 });
  }

  private _generateSeatMap(rows: number, cols: number): Seat[][] {
    const seatMap: Seat[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Seat[] = [];
      const rowChar = String.fromCharCode(65 + i);
      for (let j = 0; j < cols; j++) {
        const seat: Seat = {
          id: `${rowChar}${j + 1}`,
          status: Math.random() > 0.8 ? 'occupied' : 'available'
        };
        row.push(seat);
      }
      seatMap.push(row);
    }
    return seatMap;
  }
}