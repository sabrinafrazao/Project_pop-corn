import { Signal } from "@angular/core";
import { Cinema } from "../models/cinema.model";
import { OperationResult } from "../../models/operation-result.model";
import { Observable } from "rxjs";
import { Session } from "../models/session.model";

export abstract class AbstractCinemaService {
  // Métodos de Leitura
  abstract cinemas: Signal<Cinema[]>;
  abstract loadSessionsByMovie(movieId: number): void;
  // Método para buscar os detalhes de uma sessão específica pelo seu ID.
  abstract getSessionDetails(sessionId: number): Observable<Session | undefined>;

  // Métodos de Escrita para o Admin 
  abstract addCinema(cinema: Omit<Cinema, 'id'>): Observable<OperationResult>;
  abstract updateCinema(cinema: Cinema): Observable<OperationResult>;
  abstract deleteCinema(cinemaId: number): Observable<OperationResult>;

  // métodos para adicionar/editar/remover salas e sessões
}