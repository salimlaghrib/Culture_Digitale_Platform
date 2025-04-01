import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/resources', label: 'Resources' },
    { path: '/about', label: 'À Propos' }
  ];
  onSearch() {

  }
}
