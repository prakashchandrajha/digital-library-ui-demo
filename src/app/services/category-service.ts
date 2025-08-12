// src/app/services/category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  thumbnail?: string; // We'll use a data URL or API URL later
  imageUrl?: string;  // client-side blob URL
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/backend/api/categories'; // Spring Boot backend

  constructor(private http: HttpClient) { }

  // GET: List all categories
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // POST: Create category with name and thumbnail
  create(name: string, file: File): Observable<Category> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('thumbnail', file);

    return this.http.post<Category>(this.apiUrl, formData);
  }

  // GET: Get thumbnail image as blob
  getThumbnail(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/thumbnail`, {
      responseType: 'blob'
    });
  }
}