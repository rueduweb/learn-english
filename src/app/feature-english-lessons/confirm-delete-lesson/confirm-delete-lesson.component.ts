import { Component, inject } from '@angular/core';
import { EnglishLesson } from '../models/english-lesson.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnglishLessonsStore } from '../store/english-lessons.store';

@Component({
  selector: 'app-confirm-delete-lesson',
  imports: [],
  templateUrl: './confirm-delete-lesson.component.html',
  styleUrl: './confirm-delete-lesson.component.css',
})
export class ConfirmDeleteLessonComponent {
  store = inject(EnglishLessonsStore);
  data = inject<EnglishLesson>(MAT_DIALOG_DATA); // data from lesson selected

  deleteConfirmed(lesson: EnglishLesson) {
    if(lesson.id) {
      // TODO call the store to use deleteLesson function using
      // delete method service
    }
  }
}
