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
  imagePreviewUrl: string | null = null; // Added
  imageError: boolean = false; // Added

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
        biografia: [''], // Changed from bio
        genre: [''],
        nombreArtistico: [''],
        imagenUrl: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.userType = this.route.snapshot.params['userType'];
    this.userTypeText = this.userType === 'artist' ? 'Artista' : 'Oyente';

    // Add validators for artist-specific fields
    if (this.userType === 'artist') {
      this.registerForm
        .get('nombreArtistico')
        ?.setValidators([Validators.required]);
      this.registerForm.get('nombreArtistico')?.updateValueAndValidity();
      this.registerForm.get('imagenUrl')?.setValidators([Validators.required]);
      this.registerForm.get('imagenUrl')?.updateValueAndValidity();
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

      if (this.userType === 'artist') {
        // Prepare data for artist registration
        const artistData = {
          nombre: formData.name,
          password: formData.password,
          email: formData.email,
          nombreArtistico: formData.nombreArtistico,
          biografia: formData.biografia, // Changed from formData.bio
          imagenUrl: formData.imagenUrl, // Changed from formData.imageUrl
        };

        this.authService.registerArtista(artistData).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            // Redirect to login after successful registration
            this.router.navigate(['/login', 'artist'], {
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
      } else {
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
  }

  goToLogin(): void {
    this.router.navigate(['/login', this.userType]);
  }

  goBack(): void {
    this.router.navigate(['']);
  }

  // Added method
  validateImageUrl(event: any): void {
    const url = event.target.value;
    this.imagePreviewUrl = url;
    this.imageError = false; // Reset error on new input
  }

  // Added method
  onImageError(): void {
    this.imageError = true;
    this.imagePreviewUrl = null; // Clear preview if image fails to load
    // Optionally, set a form error for imagenUrl if direct URL validation is needed
    // this.registerForm.get('imagenUrl')?.setErrors({ invalidUrl: true });
  }
}
