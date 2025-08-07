import { Signal } from "@angular/core";
import { Cinema } from "../models/cinema.model";
import { OperationResult } from "../../models/operation-result.model";
import { Observable } from "rxjs";
import { Session } from "../models/session.model";
import { Room } from "../models/room.model";

export abstract class AbstractCinemaService {
  abstract cinemas: Signal<Cinema[]>;
  // CORREÇÃO: O método DEVE devolver a estrutura de Cinemas com as sessões filtradas.
  abstract loadSessionsByMovie(movieId: number): Observable<Cinema[]>;
  abstract getSessionDetails(sessionId: number): Observable<Session | undefined>;
  abstract addCinema(cinema: Omit<Cinema, 'id' | 'rooms'>): Observable<OperationResult>;
  abstract updateCinema(cinema: Cinema): Observable<OperationResult>;
  abstract deleteCinema(cinemaId: number): Observable<OperationResult>;
  abstract addRoom(cinemaId: number, room: Omit<Room, 'id' | 'sessions'>): Observable<OperationResult<Room>>;
  abstract updateRoom(cinemaId: number, room: Room): Observable<OperationResult<Room>>;
  abstract deleteRoom(cinemaId: number, roomId: number): Observable<OperationResult<void>>;
  abstract addSession(cinemaId: number, roomId: number, session: Omit<Session, 'id' | 'seatMap'>): Observable<OperationResult<Session>>;
  abstract deleteSession(cinemaId: number, roomId: number, sessionId: number): Observable<OperationResult<void>>;
}