import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true, // <-- Add this line to enable standalone mode
  templateUrl: './Registre.component.html',
  styleUrls: ['./Registre.component.css'],
  imports: [ // <-- Now valid because of standalone: true
    CommonModule,     // For *ngIf, *ngFor, ngClass, etc.
    FormsModule,      // For template-driven forms (ngModel)
    ReactiveFormsModule, // For reactive forms (FormGroup, FormControl)
    RouterModule,     // For routerLink and other router directives
  ],
})
export class RegisterComponent implements OnInit {
  open = false;
  passwordFieldType = 'password';
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\\]{};:\'"\\|,.<>/?]).{6,}$'),
        Validators.pattern('^\\S*$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  eyebutton() {
    this.open = !this.open;
    this.passwordFieldType = this.open ? 'text' : 'password';
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Arrêter si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...userData } = this.registerForm.value;

    console.log('Registering user:', userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Registration successful:', response);
          this.router.navigate([response.redirectPath || '/home']);
        } else {
          this.errorMessage = response.message || "Erreur lors de l'inscription";
          console.error('Registration failed:', response);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        
        if (err.status === 400) {
          this.errorMessage = err.error?.message || "Les données fournies sont invalides";
        } else if (err.status === 409) {
          this.errorMessage = "Cet email est déjà utilisé";
        } else if (err.status === 0) {
          this.errorMessage = "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.";
        } else {
          this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription";
        }
      }
    });
  }
}
