import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publication, PublicationService, PublicationType } from '../../services/PublicationService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail-component',
  imports: [CommonModule],
  templateUrl: './category-detail-component.html',
  styleUrl: './category-detail-component.css'
})
export class CategoryDetailComponent implements OnInit {

  categoryId: number;
  types: PublicationType[] = [];
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];
  selectedType: PublicationType | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService
  ) {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadTypes();
    this.loadAllPublications();
  }

  loadTypes() {
    this.publicationService.getPublicationTypes().subscribe(types => {
      this.types = types;
    });
  }

  loadAllPublications() {
    this.loading = true;
    this.publicationService.getPublicationsByCategory(this.categoryId).subscribe({
      next: (data) => {
        this.publications = data;
        this.filteredPublications = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterByType(type: PublicationType | null) {
    this.selectedType = type;
    if (!type) {
      this.filteredPublications = this.publications;
      return;
    }

    this.loading = true;
    this.publicationService.getPublicationsByCategoryAndType(this.categoryId, type.id).subscribe({
      next: (data) => {
        this.filteredPublications = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openPdf(publicationId: number) {
    this.publicationService.downloadPdf(publicationId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }
}