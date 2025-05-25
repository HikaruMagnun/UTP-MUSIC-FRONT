import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // UI state
  activeTab: 'overview' | 'music' | 'upload' | 'analytics' = 'overview';
  isUploading = false;
  selectedFile: File | null = null;

  // Data
  user = { name: 'Artist' };
  totalSongs = 0;
  totalPlays = 0;
  totalLikes = 0;
  followers = 0;
  songs: any[] = [];
  topSongs: any[] = [];

  // Upload form
  uploadForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      album: [''],
      genre: ['', Validators.required],
      releaseDate: [''],
      description: [''],
    });
  }

  setActiveTab(tab: 'overview' | 'music' | 'upload' | 'analytics') {
    this.activeTab = tab;
  }

  logout() {
    // TODO: Integrate with AuthService
    localStorage.clear();
    window.location.href = '/';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload() {
    if (this.uploadForm.invalid || !this.selectedFile) return;
    this.isUploading = true;
    // TODO: Integrate with API service
    setTimeout(() => {
      this.isUploading = false;
      this.uploadForm.reset();
      this.selectedFile = null;
      // TODO: Show success feedback
    }, 1500);
  }
}
