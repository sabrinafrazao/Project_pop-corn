export interface TicketType {
    id: 'inteira' | 'meia';
    name: string; // Ex: "Inteira", "Meia-entrada"
    price: number;
}

export interface Order {
    ticketType: TicketType;
    quantity: number;
}