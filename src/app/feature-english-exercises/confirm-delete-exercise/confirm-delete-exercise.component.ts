import { Component, inject } from '@angular/core';
import { EnglishExercise } from '../../shared/models/english-item.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EnglishExercisesStore } from '../store/english-exercises.store';

@Component({
  selector: 'app-confirm-delete-exercise',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './confirm-delete-exercise.component.html',
  styleUrl: './confirm-delete-exercise.component.css',
})
export class ConfirmDeleteExerciseComponent {
  store = inject(EnglishExercisesStore);
  data = inject<EnglishExercise>(MAT_DIALOG_DATA);
  constructor(private dialogRef: MatDialogRef<ConfirmDeleteExerciseComponent>) {}

  deleteConfirmed(exercise: EnglishExercise) {
    if(exercise.id) {
      this.store.delete(exercise.id);
      this.cancelDialog();
    }
  }

  cancelDialog() {
    this.dialogRef.close();
  }
}
