import { Injectable, signal, WritableSignal } from "@angular/core";
import { AbstractCinemaService } from "./abstract-cinema.service";
import { Cinema } from "../models/cinema.model";
import { Seat } from "../models/seat.model";
import { Session } from "../models/session.model";
import { Observable, of } from "rxjs";
import { OperationResult } from "../../models/operation-result.model";

@Injectable()
export class MockCinemaService extends AbstractCinemaService {
  
  override cinemas: WritableSignal<Cinema[]> = signal([]);
  
  private _sessionsByMovie = new Map<number, Cinema[]>();
  private _allSessions = new Map<number, Session>();

  constructor() {
    super();
    this._generateAllMockData();
  }

  override loadSessionsByMovie(movieId: number): void {
    console.log(`Buscando sessões pré-definidas para o filme com ID: ${movieId}`);
    const movieCinemas = this._sessionsByMovie.get(movieId) || [];
    this.cinemas.set(movieCinemas);
  }
  
  override getSessionDetails(sessionId: number): Observable<Session | undefined> {
    const session = this._allSessions.get(sessionId);
    return of(session);
  }


  override addCinema(cinema: Omit<Cinema, 'id'>): Observable<OperationResult> {
    console.log("MOCK: Adicionando novo cinema (não associado a um filme específico)", cinema);
    // apenas simula o sucesso da operação, como uma API faria.
    return of({ success: true, data: { ...cinema, id: Date.now() }, status: 201 });
  }

  override updateCinema(cinema: Cinema): Observable<OperationResult> {
    console.log("MOCK: Atualizando cinema", cinema);
    let updated = false;
    for (const [movieId, cinemas] of this._sessionsByMovie.entries()) {
      const index = cinemas.findIndex(c => c.id === cinema.id);
      if (index > -1) {
        const updatedCinemas = [...cinemas];
        updatedCinemas[index] = cinema;
        this._sessionsByMovie.set(movieId, updatedCinemas);
        updated = true;
      }
    }
    
    return updated 
      ? of({ success: true, data: cinema, status: 200 })
      : of({ success: false, status: 404 }); 
  }

  override deleteCinema(cinemaId: number): Observable<OperationResult> {
    console.log("MOCK: Deletando cinema com ID:", cinemaId);
    let deleted = false;
    for (const [movieId, cinemas] of this._sessionsByMovie.entries()) {
      const initialLength = cinemas.length;
      const filteredCinemas = cinemas.filter(c => c.id !== cinemaId);
      
      if (filteredCinemas.length < initialLength) {
        this._sessionsByMovie.set(movieId, filteredCinemas);
        deleted = true;
      }
    }

    return deleted
      ? of({ success: true, status: 200 })
      : of({ success: false, status: 404 });
  }

  // FUNÇÕES PARA GERAR DADOS

  private _generateAllMockData(): void {
    this._sessionsByMovie.set(1, this._generateDataForJohnWick());
    this._sessionsByMovie.set(2, this._generateDataForAvengers());
  }

  private _generateDataForJohnWick(): Cinema[] {
    const movieId = 1;
    return [
      {
        id: 1,
        name: 'Centerplex - Grande Circular',
        rooms: [
          { 
            id: 101, 
            name: 'Sala 1', 
            type: '3D', 
            sound: 'Dublado', 
            technology: 'Dolby Atmos', 
            sessions: [
              this._generateSession(1011, movieId, '20:00', 8, 12), 
              this._generateSession(1012, movieId, '22:45', 8, 12)
            ] 
          },
        ]
      },
    ];
  }

  private _generateDataForAvengers(): Cinema[] {
    const movieId = 2;
    return [
      {
        id: 2,
        name: 'Cinépolis - Ponta Negra',
        rooms: [
          { 
            id: 201, 
            name: 'Sala IMAX', 
            type: '3D', 
            sound: 'Legendado', 
            technology: 'XPlus', 
            sessions: [
              this._generateSession(2011, movieId, '18:00', 10, 15), 
              this._generateSession(2012, movieId, '21:30', 10, 15)
            ] 
          },
          { 
            id: 202, 
            name: 'Sala 3', 
            type: '2D', 
            sound: 'Dublado', 
            sessions: [
              this._generateSession(2021, movieId, '19:15', 7, 10)
            ]
          }
        ]
      },
    ];
  }
  
  private _generateSession(id: number, movieId: number, time: string, rows: number, cols: number): Session {
    const session: Session = {
      id: id,
      movieId: movieId, // Guarda o ID do filme aqui
      time: time,
      seatMap: this._generateSeatMap(rows, cols)
    };
    this._allSessions.set(id, session);
    return session;
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