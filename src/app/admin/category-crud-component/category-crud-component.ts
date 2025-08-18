import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-crud-component',
  imports: [CommonModule,ReactiveFormsModule],
  standalone:true,
  templateUrl: './category-crud-component.html',
  styleUrl: './category-crud-component.css'
})
export class CategoryCrudComponent implements OnInit {
  isModalOpen = false;
  categoryForm!: FormGroup;
  categories: Category[] = [];
  selectedFile!: File;
editingId: number | null = null; // <-- ADD THIS
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      thumbnail: [null, Validators.required]
    });
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading categories', err)
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.categoryForm.reset();
    this.selectedFile = undefined as any;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.categoryForm.patchValue({ thumbnail: this.selectedFile });
    }
  }

  updateCategory(category: Category) {
  // Open modal pre-filled for update
  this.categoryForm.patchValue({ name: category.name });
  this.selectedFile = undefined as any;
  this.isModalOpen = true;

  // Store ID for saveCategory to know it’s an update
  this.editingId = category.id;
}

saveCategory() {
  if (this.categoryForm.invalid) return;
  const { name } = this.categoryForm.value;

  if (this.editingId) {
    // Update existing category
    this.categoryService.update(this.editingId, name, this.selectedFile).subscribe({
      next: (updated) => {
        const index = this.categories.findIndex(c => c.id === updated.id);
        if (index > -1) this.categories[index] = updated;
        this.editingId = null;
        this.closeModal();
      },
      error: (err) => console.error('Error updating category:', err)
    });
  } else {
    // Create new category
    this.categoryService.create(name, this.selectedFile).subscribe({
      next: (res) => {
        this.categories.push(res);
        this.closeModal();
      },
      error: (err) => console.error('Error creating category:', err)
    });
  }
}

deleteCategory(id: number) {
  if (!confirm('Are you sure you want to delete this category?')) return;

  this.categoryService.delete(id).subscribe({
    next: () => {
      this.categories = this.categories.filter(c => c.id !== id);
    },
    error: (err) => console.error('Error deleting category:', err)
  });
}

}