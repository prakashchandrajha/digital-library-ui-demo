import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class CategoryCrudComponent implements OnInit, OnDestroy {
  isModalOpen = false;
  isDeleteModalOpen = false; // For delete confirmation
  deletingCategoryId: number | null = null; // To store which category to delete
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
      thumbnail: [null] // Validator removed
    });
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.categories.forEach(category => {
          if (category.id) { // Ensure there is an ID
            this.categoryService.getThumbnail(category.id).subscribe({
              next: (blob) => {
                category.imageUrl = URL.createObjectURL(blob);
              },
              error: (err) => {
                console.error(`Error loading thumbnail for category ${category.id}`, err);
                category.imageUrl = 'assets/images/image.png'; // Fallback image
              }
            });
          }
        });
      },
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
    this.editingId = null; // Reset editing state
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
  if (this.categoryForm.get('name')?.invalid) return;

  const { name } = this.categoryForm.value;

  if (this.editingId) {
    // Update existing category
    this.categoryService.update(this.editingId, name, this.selectedFile).subscribe({
      next: (updated) => {
        const index = this.categories.findIndex(c => c.id === updated.id);
        if (index > -1) {
          // Preserve the existing imageUrl if a new one wasn't uploaded
          const oldImageUrl = this.categories[index].imageUrl;
          this.categories[index] = updated;
          if (!this.selectedFile) {
            this.categories[index].imageUrl = oldImageUrl;
          } else {
            // If a new file was uploaded, we need to refresh the image
            this.categoryService.getThumbnail(updated.id).subscribe(blob => {
              URL.revokeObjectURL(oldImageUrl as string); // Clean up old blob url
              this.categories[index].imageUrl = URL.createObjectURL(blob);
            });
          }
        }
        this.closeModal();
      },
      error: (err) => console.error('Error updating category:', err)
    });
  } else {
    // Create new category - enforce thumbnail presence
    if (!this.selectedFile) {
      alert('Thumbnail is required for a new category.');
      return;
    }
    this.categoryService.create(name, this.selectedFile).subscribe({
      next: (res) => {
        // Fetch the new thumbnail to display it
        this.categoryService.getThumbnail(res.id).subscribe(blob => {
          res.imageUrl = URL.createObjectURL(blob);
          this.categories.push(res);
          this.closeModal();
        });
      },
      error: (err) => console.error('Error creating category:', err)
    });
  }
}

  // Step 1: Open the delete confirmation modal
  deleteCategory(id: number) {
    this.deletingCategoryId = id;
    this.isDeleteModalOpen = true;
  }

  // Step 2: Close the modal if deletion is canceled
  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.deletingCategoryId = null;
  }

  // Step 3: Perform the deletion if confirmed
  confirmDelete() {
    if (!this.deletingCategoryId) return;

    const categoryToDelete = this.categories.find(c => c.id === this.deletingCategoryId);

    this.categoryService.delete(this.deletingCategoryId).subscribe({
      next: () => {
        // Revoke the blob URL to prevent memory leaks
        if (categoryToDelete && categoryToDelete.imageUrl && categoryToDelete.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(categoryToDelete.imageUrl);
        }
        
        this.categories = this.categories.filter(c => c.id !== this.deletingCategoryId);
        this.cancelDelete(); // Close modal and reset state
      },
      error: (err) => {
        console.error('Error deleting category:', err);
        this.cancelDelete(); // Close modal and reset state even on error
      }
    });
  }

ngOnDestroy() {
  // Revoke the object URLs to avoid memory leaks
  this.categories.forEach(category => {
    if (category.imageUrl && category.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(category.imageUrl);
    }
  });
}

}