import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';
import { Publication, PublicationService, PublicationType } from '../../services/PublicationService';

interface PublicationFormValue {
  categoryId: string;
  typeId: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-publication-crud-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publication-crud-component.html',
  styleUrl: './publication-crud-component.css'
})
export class PublicationCrudComponent implements OnInit {

  isModalOpen = false;
  isEditMode = false;
  publicationForm!: FormGroup;
  submitted = false;

  categories: Category[] = [];
  publicationTypes: PublicationType[] = [];
  publications: Publication[] = [];
  selectedCategoryId: number | null = null;
  selectedTypeId: number | null = null;
  currentPublicationId: number | null = null;

  coverImageFile: File | null = null;
  pdfFile: File | null = null;

  successMessage = '';
  errorMessage = '';

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

    this.categoryService.getAll().subscribe({
      next: res => this.categories = res,
      error: err => console.error('Failed to load categories', err)
    });

    this.publicationService.getPublicationTypes().subscribe({
      next: res => this.publicationTypes = res,
      error: err => console.error('Failed to load publication types', err)
    });
  }

  loadPublicationsByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.selectedTypeId = null; // Reset type filter
    this.publicationService.getPublicationsByCategory(categoryId).subscribe({
      next: res => this.publications = res,
      error: err => console.error('Failed to load publications', err)
    });
  }

  loadPublicationsByCategoryAndType(categoryId: number, typeId: number): void {
    this.selectedCategoryId = categoryId;
    this.selectedTypeId = typeId;
    this.publicationService.getPublicationsByCategoryAndType(categoryId, typeId).subscribe({
      next: res => this.publications = res,
      error: err => console.error('Failed to load publications', err)
    });
  }

  openAddModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.publicationForm.reset();
    this.submitted = false;
  }

  openEditModal(publication: Publication): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.currentPublicationId = publication.id;
    this.successMessage = '';
    this.errorMessage = '';
    this.publicationForm.patchValue({
      title: publication.title,
      description: publication.description,
      // You might need to fetch category and type IDs if they are not in the publication object
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.publicationForm.reset();
    this.submitted = false;
    this.coverImageFile = null;
    this.pdfFile = null;
    this.currentPublicationId = null;
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
    
    if (!this.isEditMode && (!this.coverImageFile || !this.pdfFile)) {
        return;
    }

    const formValue = this.publicationForm.value as PublicationFormValue;

    const formData = new FormData();
    formData.append('categoryId', formValue.categoryId);
    formData.append('typeId', formValue.typeId);
    formData.append('title', formValue.title);
    formData.append('description', formValue.description);
    if (this.coverImageFile) {
      formData.append('coverImage', this.coverImageFile);
    }
    if (this.pdfFile) {
      formData.append('pdfFile', this.pdfFile);
    }

    if (this.isEditMode && this.currentPublicationId) {
      this.publicationService.updatePublication(this.currentPublicationId, formData).subscribe({
        next: () => {
          this.successMessage = 'Publication updated successfully!';
          if (this.selectedCategoryId && this.selectedTypeId) {
            this.loadPublicationsByCategoryAndType(this.selectedCategoryId, this.selectedTypeId);
          } else if (this.selectedCategoryId) {
            this.loadPublicationsByCategory(this.selectedCategoryId);
          }
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Failed to update publication. Please try again.';
          console.error(err);
        }
      });
    } else {
      this.publicationService.createPublication(formData).subscribe({
        next: () => {
          this.successMessage = 'Publication added successfully!';
          if (this.selectedCategoryId && this.selectedTypeId) {
            this.loadPublicationsByCategoryAndType(this.selectedCategoryId, this.selectedTypeId);
          } else if (this.selectedCategoryId) {
            this.loadPublicationsByCategory(this.selectedCategoryId);
          }
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add publication. Please try again.';
          console.error(err);
        }
      });
    }
  }

  deletePublication(id: number): void {
    if (confirm('Are you sure you want to delete this publication?')) {
      this.publicationService.deletePublication(id).subscribe({
        next: () => {
          if (this.selectedCategoryId && this.selectedTypeId) {
            this.loadPublicationsByCategoryAndType(this.selectedCategoryId, this.selectedTypeId);
          } else if (this.selectedCategoryId) {
            this.loadPublicationsByCategory(this.selectedCategoryId);
          }
        },
        error: err => console.error('Failed to delete publication', err)
      });
    }
  }
}
