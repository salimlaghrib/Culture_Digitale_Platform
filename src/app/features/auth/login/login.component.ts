// login.component.ts - AJOUTEZ CE CODE
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  open: boolean = false;
  passwordFieldType: string = "password";
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false; // AJOUTEZ CETTE PROPRIÉTÉ MANQUANTE

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(12)]]
    });
  }

  eyebutton() {
    this.open = !this.open;
    this.passwordFieldType = this.open ? "text" : "password";
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true; // ACTIVEZ LE LOADING
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false; // DÉSACTIVEZ LE LOADING
          if (response.success) {
            this.router.navigate([response.redirectPath]);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (err) => {
          this.isLoading = false; // DÉSACTIVEZ LE LOADING EN CAS D'ERREUR
          this.errorMessage = 'Erreur lors de la connexion';
          console.error('Login error:', err);
        }
      });
    }
  }
}
