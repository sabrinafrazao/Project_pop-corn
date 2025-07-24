import { Component, signal, HostBinding } from '@angular/core'; // 1. Importa o HostBinding
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isCollapsed = signal(false);

  @HostBinding('class.collapsed') get collapsed() {
    return this.isCollapsed();
  }

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }
}