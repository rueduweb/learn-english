import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnglishLesson } from '../models/english-lesson.model';

@Injectable({
  providedIn: 'root'
})
export class EnglishLessonsService {

  private readonly baseURL = 'https://localhost:3000/englishlessons';

  http = inject(HttpClient);

  getEnglishLessons(): Observable<EnglishLesson[]> {
    return this.http.get<EnglishLesson[]>(`${this.baseURL}?_sort=category,title,current_status&_order=desc`);
  }
}
