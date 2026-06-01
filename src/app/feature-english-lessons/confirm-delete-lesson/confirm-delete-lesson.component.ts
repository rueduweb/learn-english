import { Component, inject } from '@angular/core';
import { EnglishLesson } from '../models/english-lesson.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EnglishLessonsStore } from '../store/english-lessons.store';

@Component({
  selector: 'app-confirm-delete-lesson',
  imports: [MatButtonModule, MatIconModule ],
  templateUrl: './confirm-delete-lesson.component.html',
  styleUrl: './confirm-delete-lesson.component.css',
})
export class ConfirmDeleteLessonComponent {
  store = inject(EnglishLessonsStore);
  data = inject<EnglishLesson>(MAT_DIALOG_DATA); // data from lesson selected

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteLessonComponent>) {}

  deleteConfirmed(lesson: EnglishLesson) {
    if(lesson.id) {
      this.store.deleteLesson(lesson.id);
      this.cancelDialog();
      window.location.reload();
    }
  }

  cancelDialog() {
    this.dialogRef.close();
  }

}
