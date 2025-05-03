import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './Registre.component.html',
  styleUrls: ['./Registre.component.css']
})
export class RegisterComponent {
  open = false;
  passwordFieldType = 'password';
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate([response.redirectPath]);
          } else {
            this.errorMessage = response.message || "Erreur lors de l'inscription";
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = "Erreur lors de l'inscription";
          console.error('Register error:', err);
        }
      });
    }
  }
}
