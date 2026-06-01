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
import { Router } from '@angular/router';
import { EnglishLessonsStore } from '../store/english-lessons.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnglishLesson } from '../models/english-lesson.model';
import { Guid } from "guid-typescript";

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
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(128)]],
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
      if (this.data && this.data.id) {
        // retrieving typed form data
        const updatedLesson: EnglishLesson = this.lessonForm.getRawValue();
        // Calling the SignalStore method to update the lesson
        await this.store.updateEnglishLesson(this.data.id, updatedLesson);
        // If the update was successful (no errors in the store), the form is reset.
        if (!this.store.hasError()) {
          this.lessonForm.reset();
        }
      } else {

        const newLesson: EnglishLesson = this.lessonForm.getRawValue();
        // Assign an ID to the lesson
        let anId = Guid.create();
        const itemOnLesson = Object.assign({id: anId.toString()}, newLesson);
        // Calling the SignalStore method to add the lesson
        await this.store.addEnglishLesson(itemOnLesson);

        if (!this.store.hasError()) {
          this.lessonForm.reset();
        }
      }
      this.closeDialog();
      window.location.reload();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
