import { Component } from '@angular/core';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-category-component',
  imports: [CommonModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent {
  categories: Category[] = [];
  loading = false;
  error = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

 loadCategories() {
  this.loading = true;
  this.categoryService.getAll().subscribe({
    next: (data) => {
      this.categories = data;

      // For each category, load the image blob and convert to object URL
      for (const category of this.categories) {
        this.categoryService.getThumbnail(category.id).subscribe({
          next: (blob) => {
            const objectURL = URL.createObjectURL(blob);
            category.imageUrl = objectURL;
          },
          error: (err) => {
            console.warn(`Failed to load thumbnail for category ${category.id}`, err);
          }
        });
      }

      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load categories. Is Spring Boot running?';
      this.loading = false;
      console.error(err);
    }
  });
}
}
