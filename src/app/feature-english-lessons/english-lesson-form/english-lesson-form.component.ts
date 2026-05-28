import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnglishLessonsService } from '../services/english-lessons.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatOption } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EnglishLessonsStore } from '../store/english-lessons.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnglishLesson } from '../models/english-lesson.model';

@Component({
  selector: 'app-english-lesson-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOption,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './english-lesson-form.component.html',
  styleUrl: './english-lesson-form.component.css',
  providers: [provideNativeDateAdapter()]
})
export class EnglishLessonFormComponent implements OnInit{
  store = inject(EnglishLessonsStore);
  englishLessonsService = inject(EnglishLessonsService);

  lessonForm!: FormGroup;

  categories = ['Vocabulary', 'Grammar', 'Comprehension', 'Pronunciation', 'Assessment', 'Test'];
  currentStatus = ['Todo', 'Done', 'In progress'];

  data = inject<EnglishLesson>(MAT_DIALOG_DATA); // data from lesson selected

  private fb = inject(FormBuilder);

  constructor(private dialogRef: MatDialogRef<EnglishLessonFormComponent>) {}

  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      day: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      current_status: ['', Validators.required],
      coach: ['', Validators.required],
      groupLesson: [false, Validators.required]
    });

    if (this.data) {
      this.lessonForm.patchValue(this.data);
    }
  }

  async onSubmit() {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }
    if (this.lessonForm.valid) {
      if (this.data && this.data.id) { // TODO this by updating the store
        this.englishLessonsService.updateEnglishLesson(this.data.id, this.lessonForm.value);
      } else {
        // Récupération des données typées du formulaire
        const newLesson: EnglishLesson = this.lessonForm.getRawValue();
        // Assigner un ID à la leçon
        let anId = this.store.lessonCount() + 1; // TODO improve
        const itemOnLesson = Object.assign({id: anId.toString()}, newLesson);
        // Appel de la méthode du SignalStore (qui gère l'async/await en interne)
        await this.store.addEnglishLesson(itemOnLesson);

        // Si l'ajout a réussi (pas d'erreur dans le store), on réinitialise le formulaire
        if (!this.store.hasError()) {
          this.lessonForm.reset();
        }
      }
      this.lessonForm.reset();
      this.dialogRef.close();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
