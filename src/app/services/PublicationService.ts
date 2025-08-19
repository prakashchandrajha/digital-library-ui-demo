// src/app/services/publication.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PublicationType {
  id: number;
  name: string;
}

export interface Publication {
  id: number;
  title: string;
  description: string;
  coverImage: string; // will be data URL or null
  pdfFileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private apiUrl = 'http://localhost:8080/backend/api';

  constructor(private http: HttpClient) { }

  // GET all publication types (for badges)
  getPublicationTypes(): Observable<PublicationType[]> {
    return this.http.get<PublicationType[]>(`${this.apiUrl}/publication-types`);
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

  getCoverImageUrl(publicationId: number): string {
  return `http://localhost:8080/backend/api/publications/${publicationId}/cover`;
}


createPublication(formData: FormData): Observable<Publication> {
  return this.http.post<Publication>(`${this.apiUrl}/publications`, formData);
}

getPublicationsByType(typeId: number): Observable<Publication[]> {
  return this.http.get<Publication[]>(`${this.apiUrl}/publications/type/${typeId}`);
}

updatePublication(id: number, formData: FormData): Observable<Publication> {
  return this.http.put<Publication>(`${this.apiUrl}/publications/${id}`, formData);
}

deletePublication(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/publications/${id}`);
}

}