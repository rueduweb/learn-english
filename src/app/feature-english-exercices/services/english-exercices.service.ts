import { Injectable } from '@angular/core';
import { EnglishExercice } from '../../shared/models/english-item.model';

@Injectable({
  providedIn: 'root',
})
export class EnglishExercicesService {
  private readonly baseURL = 'http://localhost:3000/englishexercices';
}
