// src/app/services/publication.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicationType {
  id: number;
  name: string;
}

export interface Publication {
  id: number;
  title: string;
  description: string;
  category?: { id: number; name: string };
  publicationType?: { id: number; name: string };
  coverImagePath?: string;
  pdfPath?: string;
  coverImageUrl?: string; // For client-side display
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private apiUrl = 'http://localhost:8080/backend/api';

  constructor(private http: HttpClient) { }

  // GET all publications (paginated)
  getAll(page: number, size: number): Observable<Page<Publication>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Publication>>(`${this.apiUrl}/publications`, { params });
  }

  // GET a single publication by ID
  getById(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${this.apiUrl}/publications/${id}`);
  }

  // GET all publication types (for badges)
  getPublicationTypes(): Observable<PublicationType[]> {
    return this.http.get<PublicationType[]>(`${this.apiUrl}/publications/types`);
  }

  // GET all publications by category
  getPublicationsByCategory(categoryId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/publications/category/${categoryId}`);
  }

  // GET publications by category + type
  getPublicationsByCategoryAndType(categoryId: number, typeId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/publications/category/${categoryId}/type/${typeId}`);
  }

  // GET PDF as blob
  downloadPdf(publicationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/publications/${publicationId}/pdf`, {
      responseType: 'blob'
    });
  }

  // GET cover image as blob
  getCoverImage(publicationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/publications/${publicationId}/cover`, {
      responseType: 'blob'
    });
  }


createPublication(formData: FormData): Observable<Publication> {
  return this.http.post<Publication>(`${this.apiUrl}/publications`, formData);
}

// PUT: Update an existing publication
updatePublication(id: number, formData: FormData): Observable<Publication> {
  return this.http.put<Publication>(`${this.apiUrl}/publications/${id}`, formData);
}

// DELETE: Remove a publication
deletePublication(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/publications/${id}`);
}

}