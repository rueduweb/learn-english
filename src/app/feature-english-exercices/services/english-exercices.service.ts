import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnglishExercice } from '../../shared/models/english-item.model';

@Injectable({
  providedIn: 'root',
})
export class EnglishExercicesService {
  private readonly baseURL = 'http://localhost:3000/englishexercices';

  http = inject(HttpClient);

  getEnglishExercices(): Observable<EnglishExercice[]> {
      return this.http.get<EnglishExercice[]>(`${this.baseURL}`);
    }

  createEnglishExercice(lesson: EnglishExercice): Observable<EnglishExercice> {
    return this.http.post<EnglishExercice>(this.baseURL, lesson);
  }

  updateEnglishExercice(id: string, lesson: EnglishExercice): Observable<EnglishExercice> {
    return this.http.put<EnglishExercice>(`${this.baseURL}/${id}`, lesson);
  }

  deleteEnglishExercice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

}
