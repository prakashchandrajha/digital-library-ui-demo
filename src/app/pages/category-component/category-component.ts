import { Component, AfterViewInit } from '@angular/core';
import { Category, CategoryService } from '../../services/category-service';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// Swiper imports
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

@Component({
  selector: 'app-category-component',
  imports: [CommonModule,RouterModule],
  templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent implements AfterViewInit {
  categories: Category[] = [];
  loading = false;
  error = '';
  private swiperInstance: any; // Store Swiper instance
  
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }
  
  ngAfterViewInit(): void {
    // Initialize Swiper after the view is rendered
    // We need to wait for the categories to be loaded and rendered
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }
  
  private initSwiper(): void {
    if (typeof Swiper !== 'undefined') {
      this.swiperInstance = new Swiper('.swiper', {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }
      });
    }
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
