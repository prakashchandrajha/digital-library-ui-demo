import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';
import { PublicationService, PublicationType, Publication, Page } from '../../services/PublicationService';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-publication-crud-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publication-crud-component.html',
  styleUrls: ['./publication-crud-component.css']
})
export class PublicationCrudComponent implements OnInit, OnDestroy {

  // Modal and Form State
  isModalOpen = false;
  publicationForm!: FormGroup;
  submitted = false;
  editingPublicationId: number | null = null;

  // Data
  publications: Publication[] = [];
  categories: Category[] = [];
  publicationTypes: PublicationType[] = [];

  // File Upload State
  coverImageFile: File | null = null;
  pdfFile: File | null = null;

  // Messaging
  successMessage = '';
  errorMessage = '';

  // Delete Modal State
  isDeleteModalOpen = false;
  deletingPublicationId: number | null = null;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    this.publicationForm = this.fb.group({
      categoryId: ['', Validators.required],
      typeId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.loadPublications();
    this.loadCategories();
    this.loadPublicationTypes();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.publications.forEach(pub => {
      if (pub.coverImageUrl && pub.coverImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pub.coverImageUrl);
      }
    });
  }

  loadPublications(): void {
    const sub = this.publicationService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<Publication>) => {
        // Clean up old blob URLs before assigning new data
        this.publications.forEach(pub => {
          if (pub.coverImageUrl && pub.coverImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pub.coverImageUrl);
          }
        });

        this.publications = page.content;
        this.totalPages = page.totalPages;
        this.publications.forEach(pub => {
          const coverSub = this.publicationService.getCoverImage(pub.id).subscribe(blob => {
            pub.coverImageUrl = URL.createObjectURL(blob);
          });
          this.subscriptions.push(coverSub);
        });
      },
      error: (err) => console.error('Failed to load publications', err)
    });
    this.subscriptions.push(sub);
  }

  loadCategories(): void {
    const sub = this.categoryService.getAll().subscribe({
      next: res => this.categories = res,
      error: err => console.error('Failed to load categories', err)
    });
    this.subscriptions.push(sub);
  }

  loadPublicationTypes(): void {
    const sub = this.publicationService.getPublicationTypes().subscribe({
      next: res => this.publicationTypes = res,
      error: err => console.error('Failed to load publication types', err)
    });
    this.subscriptions.push(sub);
  }

  openAddModal(): void {
    this.editingPublicationId = null;
    this.submitted = false;
    this.publicationForm.reset({ categoryId: '', typeId: '' });
    this.isModalOpen = true;
  }

  openEditModal(publication: Publication): void {
    this.editingPublicationId = publication.id;
    this.submitted = false;
    this.publicationForm.patchValue({
      title: publication.title,
      description: publication.description,
      categoryId: publication.category?.id || '',
      typeId: publication.publicationType?.id || ''
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.coverImageFile = null;
    this.pdfFile = null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.coverImageFile = input.files[0];
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.pdfFile = input.files[0];
    }
  }

  submitPublication(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.publicationForm.invalid) {
      return;
    }

    if (!this.editingPublicationId && (!this.coverImageFile || !this.pdfFile)) {
      this.errorMessage = 'Cover image and PDF file are required for a new publication.';
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', this.publicationForm.get('categoryId')?.value);
    formData.append('typeId', this.publicationForm.get('typeId')?.value);
    formData.append('title', this.publicationForm.get('title')?.value);
    formData.append('description', this.publicationForm.get('description')?.value);

    if (this.coverImageFile) {
      formData.append('coverImage', this.coverImageFile);
    }
    if (this.pdfFile) {
      formData.append('pdfFile', this.pdfFile);
    }

    if (this.editingPublicationId) {
      // UPDATE LOGIC
      const updateSub = this.publicationService.updatePublication(this.editingPublicationId, formData).subscribe({
        next: (updatedPub) => {
          const index = this.publications.findIndex(p => p.id === this.editingPublicationId);
          if (index !== -1) {
            const oldImageUrl = this.publications[index].coverImageUrl;
            
            // If a new image was uploaded, fetch it. Otherwise, keep the old one.
            if (this.coverImageFile) {
              const coverSub = this.publicationService.getCoverImage(updatedPub.id).subscribe(blob => {
                if (oldImageUrl && oldImageUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(oldImageUrl);
                }
                updatedPub.coverImageUrl = URL.createObjectURL(blob);
                this.publications[index] = updatedPub;
              });
              this.subscriptions.push(coverSub);
            } else {
              updatedPub.coverImageUrl = oldImageUrl;
              this.publications[index] = updatedPub;
            }
          }
          this.successMessage = 'Publication updated successfully!';
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          this.errorMessage = 'An error occurred during update. Please try again.';
          console.error(err);
        }
      });
      this.subscriptions.push(updateSub);
    } else {
      // CREATE LOGIC
      const createSub = this.publicationService.createPublication(formData).subscribe({
        next: (newPub) => {
          const coverSub = this.publicationService.getCoverImage(newPub.id).subscribe(blob => {
            newPub.coverImageUrl = URL.createObjectURL(blob);
            this.publications.unshift(newPub); // Add to the beginning of the list
          });
          this.subscriptions.push(coverSub);
          this.successMessage = 'Publication added successfully!';
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          this.errorMessage = 'An error occurred during creation. Please try again.';
          console.error(err);
        }
      });
      this.subscriptions.push(createSub);
    }
  }

  deletePublication(id: number): void {
    this.deletingPublicationId = id;
    this.isDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.deletingPublicationId = null;
  }

  confirmDelete(): void {
    if (!this.deletingPublicationId) return;

    const idToDelete = this.deletingPublicationId;
    const sub = this.publicationService.deletePublication(idToDelete).subscribe({
      next: () => {
        const index = this.publications.findIndex(p => p.id === idToDelete);
        if (index !== -1) {
          const pubToDelete = this.publications[index];
          if (pubToDelete.coverImageUrl && pubToDelete.coverImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pubToDelete.coverImageUrl);
          }
          this.publications.splice(index, 1);
        }
        this.cancelDelete();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // Already deleted on server, just remove from UI
          const index = this.publications.findIndex(p => p.id === idToDelete);
          if (index !== -1) {
            this.publications.splice(index, 1);
          }
        } else {
          this.errorMessage = 'Failed to delete publication.';
          console.error(err);
        }
        this.cancelDelete();
      }
    });
    this.subscriptions.push(sub);
  }
}
