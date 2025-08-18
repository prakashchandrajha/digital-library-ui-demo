import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';
import { PublicationService, PublicationType } from '../../services/PublicationService';

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
  publicationForm!: FormGroup;
  submitted = false;

  categories: Category[] = [];
  publicationTypes: PublicationType[] = [];

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

  openAddModal(): void {
    this.isModalOpen = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.publicationForm.reset();
    this.submitted = false;
    this.coverImageFile = null;
    this.pdfFile = null;
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

    if (this.publicationForm.invalid || !this.coverImageFile || !this.pdfFile) {
      return;
    }

    const formValue = this.publicationForm.value as PublicationFormValue;

    const formData = new FormData();
    formData.append('categoryId', formValue.categoryId);
    formData.append('typeId', formValue.typeId);
    formData.append('title', formValue.title);
    formData.append('description', formValue.description);
    formData.append('coverImage', this.coverImageFile);
    formData.append('pdfFile', this.pdfFile);

    this.publicationService.createPublication(formData).subscribe({
      next: () => {
        this.successMessage = 'Publication added successfully!';
        this.publicationForm.reset();
        this.submitted = false;
        this.coverImageFile = null;
        this.pdfFile = null;
      },
      error: (err) => {
        this.errorMessage = 'Failed to add publication. Please try again.';
        console.error(err);
      }
    });
  }
}