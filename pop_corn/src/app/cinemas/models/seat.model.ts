export interface Seat {
  id: string; // tipo "A1", "B12", etc.
  status: 'available' | 'occupied' | 'selected';
  type?: 'normal' | 'vip' | 'disabled_access'; 
}