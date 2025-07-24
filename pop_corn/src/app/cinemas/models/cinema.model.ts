import { Room } from "./room.model";

export interface Cinema {
  id: number;
  name: string; // Ex: "Centerplex - Grande Circular"
  rooms: Room[];
}