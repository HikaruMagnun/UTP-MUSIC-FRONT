import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userType: string = '';
  userTypeText: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        bio: [''],
        genre: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.userType = this.route.snapshot.params['userType'];
    this.userTypeText = this.userType === 'artist' ? 'Artista' : 'Oyente';

    // Add genre as required for artists
    if (this.userType === 'artist') {
      this.registerForm.get('genre')?.setValidators([Validators.required]);
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.registerForm.value;

      // Prepare data for listener registration
      const listenerData = {
        nombre: formData.name,
        password: formData.password,
        email: formData.email,
      };

      this.authService.registerListener(listenerData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Redirect to login after successful registration
          this.router.navigate(['/login', 'listener'], {
            queryParams: {
              message: 'Cuenta creada exitosamente. Por favor inicia sesión.',
            },
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Error al crear la cuenta. Inténtalo de nuevo.';
        },
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login', this.userType]);
  }

  goBack(): void {
    this.router.navigate(['']);
  }
}
