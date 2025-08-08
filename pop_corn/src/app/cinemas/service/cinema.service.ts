// src/app/cinemas/service/cinema.service.ts
import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
import { cloneDeep } from 'lodash';

import { AbstractCinemaService } from './abstract-cinema.service';
import { Cinema } from '../models/cinema.model';
import { Session } from '../models/session.model';
import { Room } from '../models/room.model';
import { OperationResult } from '../../models/operation-result.model';
import { environment } from '../../../environment/environment';

@Injectable()
export class CinemaService extends AbstractCinemaService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  cinemas = signal<Cinema[]>([]);

  constructor() {
    super();
    if (isPlatformBrowser(this.platformId)) {
      this.loadAllCinemas(); // Carrega todos os cinemas uma vez para o admin
    }
  }

  private loadAllCinemas(): void {
    this.http.get<Cinema[]>(`${this.apiUrl}/cinemas`).subscribe(cinemas => {
      this.cinemas.set(cinemas);
    });
  }

  loadSessionsByMovie(movieId: number): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${this.apiUrl}/movies/${movieId}/sessions`);
  }

  getSessionDetails(sessionId: number): Observable<Session | undefined> {
    // --- CORREÇÃO AQUI ---
    // Agora faz uma chamada HTTP real para o novo endpoint
    return this.http.get<Session>(`${this.apiUrl}/sessions/${sessionId}`);
    // ---------------------
  }

  addCinema(cinema: Omit<Cinema, 'id' | 'rooms'>): Observable<OperationResult> {
    return this.http.post<Cinema>(`${this.apiUrl}/cinemas`, cinema).pipe(
      tap(() => this.loadAllCinemas()),
      map(newCinema => ({ success: true, data: newCinema })),
      catchError(err => of({ success: false, data: err }))
    );
  }

  addRoom(cinemaId: number, room: Omit<Room, 'id' | 'sessions'>): Observable<OperationResult<Room>> {
    return this.http.post<Room>(`${this.apiUrl}/cinemas/${cinemaId}/rooms`, room).pipe(
      tap(() => this.loadAllCinemas()),
      map(newRoom => ({ success: true, data: newRoom })),
      catchError(err => of({ success: false, data: err }))
    );
  }

  addSession(cinemaId: number, roomId: number, session: Omit<Session, 'id' | 'seatMap'>): Observable<OperationResult<Session>> {
    const payload = {
      time: session.time,
      movie_id: session.movieId 
    };

    return this.http.post<Session>(`${this.apiUrl}/rooms/${roomId}/sessions`, payload).pipe(
      tap(() => this.loadAllCinemas()),
      map(newSession => ({ success: true, data: newSession })),
      catchError(err => of({ success: false, data: err }))
    );
  }
  
  // Métodos de update e delete podem ser implementados aqui quando necessário
  updateCinema(cinema: Cinema): Observable<OperationResult> {
    throw new Error('Method not implemented.');
  }
  deleteCinema(cinemaId: number): Observable<OperationResult> {
    throw new Error('Method not implemented.');
  }
  updateRoom(cinemaId: number, room: Room): Observable<OperationResult<Room>> {
    throw new Error('Method not implemented.');
  }
  deleteRoom(cinemaId: number, roomId: number): Observable<OperationResult<void>> {
    throw new Error('Method not implemented.');
  }
  deleteSession(cinemaId: number, roomId: number, sessionId: number): Observable<OperationResult<void>> {
    throw new Error('Method not implemented.');
  }
}

