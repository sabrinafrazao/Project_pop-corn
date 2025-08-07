export interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
  duration: string;
  rating: number; // A nota de 1 a 5 estrelas
  synopsis: string;
  ageRating: string; // A classificação indicativa
}