import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EnglishExercisesStore } from '../store/english-exercises.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnglishExercise } from '../../shared/models/english-item.model';
import { Guid } from "guid-typescript";
import { EnglishExercisesService } from '../services/english-exercises.service';
@Component({
  selector: 'app-english-exercise-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOption,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './english-exercise-form.component.html',
  styleUrl: './english-exercise-form.component.css',
  providers: [provideNativeDateAdapter()]
})
export class EnglishExerciseFormComponent implements OnInit{
  store = inject(EnglishExercisesStore);
  englishExercisesService = inject(EnglishExercisesService);

  exerciseForm!: FormGroup;

  categories = ['Vocabulary', 'Grammar', 'Comprehension', 'Pronunciation', 'Assessment', 'Test'];
  currentStatus = ['Todo', 'Done', 'In progress'];

  data = inject<EnglishExercise | null>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);

  constructor(private dialogRef: MatDialogRef<EnglishExerciseFormComponent>) {}

  ngOnInit(): void {
    this.exerciseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(128)]],
      category: ['', Validators.required],
      day: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      current_status: ['', Validators.required],
      score: [''],
      comment: ['']
    })

    if (this.data) {
      this.exerciseForm.patchValue(this.data);
    }
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }
    if (this.exerciseForm.valid) {
      if (this.data && this.data.id) {
        const updatedExercise: EnglishExercise = this.exerciseForm.getRawValue();
        // Calling the SignalStore method to update the exercise
        await this.store.update(this.data.id, updatedExercise);
        // If the update was successful (no errors in the store), the form is reset.
        if (!this.store.error()) {
          this.exerciseForm.reset();
        }
      } else {
        const newExercise: EnglishExercise = this.exerciseForm.getRawValue();

        let anId = Guid.create();
        const itemOnExercise = Object.assign({id: anId.toString()}, newExercise);

        console.log('item to create: ', itemOnExercise);
        // Calling the SignalStore method to add the exercise
        await this.store.create(itemOnExercise);

        if(!this.store.error()) {
          this.exerciseForm.reset();
        }
      }
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
