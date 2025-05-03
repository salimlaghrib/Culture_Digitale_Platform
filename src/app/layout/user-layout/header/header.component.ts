import { Component } from '@angular/core';
import {Route, Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private route:Router) {
  }
  navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/resources', label: 'Resources' },
    { path: '/about', label: 'À Propos' }
  ];
  onSearch() {

  }

  goToLogin() {
    this.route.navigateByUrl("login")
  }


  goTosignin() {
    this.route.navigateByUrl("signin")
  }
}
