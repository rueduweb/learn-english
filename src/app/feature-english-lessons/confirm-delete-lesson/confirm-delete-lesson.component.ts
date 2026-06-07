import { Component, inject } from '@angular/core';
import { EnglishLesson } from '../../shared/models/english-item.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EnglishLessonsStore } from '../store/english-lessons.store';
import { NotificationComponent } from '../../shared/notification/notification.component';
@Component({
  selector: 'app-confirm-delete-lesson',
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './confirm-delete-lesson.component.html',
  styleUrl: './confirm-delete-lesson.component.css',
})
export class ConfirmDeleteLessonComponent {
  store = inject(EnglishLessonsStore);
  data = inject<EnglishLesson>(MAT_DIALOG_DATA); // data from lesson selected
  notif = inject(MatSnackBar);

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteLessonComponent>) {}

  deleteConfirmed(lesson: EnglishLesson) {
    if(lesson.id) {
      this.store.deleteLesson(lesson.id);
      this.cancelDialog();
      this.openNotification('Lesson deleted successfully.', 'Delete');
    }
  }

  cancelDialog() {
    this.dialogRef.close();
  }

  openNotification(value: string, action: string) {
    let datas: string[] = [value, action];
    this.notif.openFromComponent(NotificationComponent, {
      data: datas
    });
  }

}
