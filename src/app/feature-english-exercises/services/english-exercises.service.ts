import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnglishExercise } from '../../shared/models/english-item.model';

@Injectable({
  providedIn: 'root',
})
export class EnglishExercisesService {
  private readonly baseURL = 'http://localhost:3000/englishExercises';

  http = inject(HttpClient);

  getEnglishExercises(): Observable<EnglishExercise[]> {
      return this.http.get<EnglishExercise[]>(`${this.baseURL}`);
    }

  createEnglishExercise(lesson: EnglishExercise): Observable<EnglishExercise> {
    return this.http.post<EnglishExercise>(this.baseURL, lesson);
  }

  updateEnglishExercise(id: string, lesson: EnglishExercise): Observable<EnglishExercise> {
    return this.http.put<EnglishExercise>(`${this.baseURL}/${id}`, lesson);
  }

  deleteEnglishExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

}
