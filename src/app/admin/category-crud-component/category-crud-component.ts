import { Component } from '@angular/core';
import { CategoryService } from '../../services/category-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-crud-component',
  imports: [CommonModule,FormsModule],
  standalone:true,
  templateUrl: './category-crud-component.html',
  styleUrl: './category-crud-component.css'
})
export class CategoryCrudComponent {
isModalOpen = false;
  categoryName = '';
  selectedFile!: File;

  constructor(private categoryService: CategoryService) {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.categoryName = '';
    this.selectedFile = undefined as any;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveCategory() {
    if (!this.categoryName || !this.selectedFile) return;

    this.categoryService.create(this.categoryName, this.selectedFile)
      .subscribe({
        next: (res) => {
          console.log('Category created:', res);
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating category:', err);
        }
      });
  }
}
