import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnglishLesson } from '../models/english-lesson.model';

@Injectable({
  providedIn: 'root'
})
export class EnglishLessonsService {

  private readonly baseURL = 'http://localhost:3000/englishlessons';

  http = inject(HttpClient);

  getEnglishLessons(): Observable<EnglishLesson[]> {
    return this.http.get<EnglishLesson[]>(`${this.baseURL}`);
  }
}
