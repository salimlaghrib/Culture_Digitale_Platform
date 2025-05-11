import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../core/services/auth.service";
import { HeaderComponent } from '../../../layout/user-layout/header/header.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router:Router,private authService:AuthService) {
  }
  gotosequence() {
    if(this.authService.isAuthenticated()){
      this.router.navigateByUrl('/sequences')
    }
    else{
      this.router.navigateByUrl('/login')
    }

  }
}
