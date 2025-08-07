import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractOrderService } from '../../order/services/abstract-order.service';
import { AbstractMovieService } from '../../movies/service/abstract-movie.service';
import { AbstractCinemaService } from '../../cinemas/service/abstract-cinema.service';

// Interface para os nossos dados de ranking
interface MovieRanking {
  title: string;
  revenue: number;
}

interface CinemaRanking {
  name: string;
  revenue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private orderService = inject(AbstractOrderService);
  private movieService = inject(AbstractMovieService);
  private cinemaService = inject(AbstractCinemaService);

  // Sinal com todos os pedidos finalizados
  private allOrders = this.orderService.completedOrders;

  // --- KPIs Principais (Calculados com `computed`) ---

  totalRevenue = computed(() => {
    return this.allOrders()
      .filter(order => order.status !== 'Cancelado')
      .reduce((acc, order) => acc + order.totalPrice, 0);
  });

  totalTicketsSold = computed(() => {
    return this.allOrders()
      .filter(order => order.status !== 'Cancelado')
      .reduce((acc, order) => acc + order.ticketOrder.reduce((ticketAcc, ticket) => ticketAcc + ticket.quantity, 0), 0);
  });

  bestSellingMovie = computed(() => {
    const movieSales = new Map<string, number>();
    this.allOrders()
      .filter(order => order.status !== 'Cancelado')
      .forEach(order => {
        const count = movieSales.get(order.movieTitle) || 0;
        const ticketsInOrder = order.ticketOrder.reduce((acc, t) => acc + t.quantity, 0);
        movieSales.set(order.movieTitle, count + ticketsInOrder);
      });
    
    if (movieSales.size === 0) return 'N/A';

    return [...movieSales.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
  });

  // --- Dados para os Gráficos e Rankings ---

  cinemaRevenueRanking = computed(() => {
    const cinemaRevenue = new Map<string, number>();
    this.allOrders()
      .filter(order => order.status !== 'Cancelado')
      .forEach(order => {
        const currentRevenue = cinemaRevenue.get(order.cinemaName) || 0;
        cinemaRevenue.set(order.cinemaName, currentRevenue + order.totalPrice);
      });
    
    return Array.from(cinemaRevenue.entries())
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  });

  movieRevenueRanking = computed(() => {
    const movieRevenue = new Map<string, number>();
    this.allOrders()
      .filter(order => order.status !== 'Cancelado')
      .forEach(order => {
        const currentRevenue = movieRevenue.get(order.movieTitle) || 0;
        movieRevenue.set(order.movieTitle, currentRevenue + order.totalPrice);
      });

    return Array.from(movieRevenue.entries())
      .map(([title, revenue]) => ({ title, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  });

  // Helper para o gráfico de barras
  getBarWidth(revenue: number, maxRevenue: number): string {
    if (maxRevenue === 0) return '0%';
    const percentage = (revenue / maxRevenue) * 100;
    return `${percentage}%`;
  }

  get maxCinemaRevenue(): number {
    return Math.max(...this.cinemaRevenueRanking().map(c => c.revenue), 0);
  }
}