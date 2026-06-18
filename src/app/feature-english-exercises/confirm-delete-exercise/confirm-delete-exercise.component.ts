import { Component, inject } from '@angular/core';
import { EnglishExercise } from '../../shared/models/english-item.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EnglishExercisesStore } from '../store/english-exercises.store';
import { NotificationComponent } from '../../shared/notification/notification.component';

@Component({
  selector: 'app-confirm-delete-exercise',
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './confirm-delete-exercise.component.html',
  styleUrl: './confirm-delete-exercise.component.css',
})
export class ConfirmDeleteExerciseComponent {
  store = inject(EnglishExercisesStore);
  data = inject<EnglishExercise>(MAT_DIALOG_DATA);
  notif = inject(MatSnackBar);

  constructor(private dialogRef: MatDialogRef<ConfirmDeleteExerciseComponent>) {}

  deleteConfirmed(exercise: EnglishExercise) {
    if(exercise.id) {
      this.store.delete(exercise.id);
      this.cancelDialog();
      this.openNotification('Exercise deleted successfully.', 'Delete');
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
