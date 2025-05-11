import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit {
  open: boolean = false;
  passwordFieldType: string = "password";
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si l'utilisateur est déjà connecté, rediriger vers la page appropriée
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getRedirectPath()]);
    }

    // Initialize the form with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  eyebutton() {
    this.open = !this.open;
    this.passwordFieldType = this.open ? "text" : "password";
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    console.log('Logging in with:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Raw login response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('Login successful:', response);
          
          // Vérifier si l'utilisateur est bien authentifié
          if (!this.authService.isAuthenticated()) {
            console.error('User not authenticated after successful login');
            this.errorMessage = 'Erreur lors de l\'authentification';
            return;
          }

          // Vérifier le rôle de l'utilisateur
          const userData = this.authService.getUserData();
          console.log('User data after login:', userData);

          // Check if there's a redirect URL in sessionStorage
          const redirectUrl = sessionStorage.getItem('redirectUrl');
          if (redirectUrl) {
            console.log('Redirecting to stored URL:', redirectUrl);
            sessionStorage.removeItem('redirectUrl');
            this.router.navigateByUrl(redirectUrl);
          } else {
            // Rediriger vers la page appropriée selon le rôle
            const redirectPath = this.authService.getRedirectPath();
            console.log('Redirecting to default path:', redirectPath);
            this.router.navigate([redirectPath]);
          }
        } else {
          this.errorMessage = response.message || 'Échec de la connexion';
          console.error('Login failed:', response);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la connexion';
        console.error('Login error:', err);
      }
    });
  }
}
