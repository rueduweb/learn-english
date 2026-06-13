import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';

import { EnglishExercise } from '../../shared/models/english-item.model';
import { EnglishExercisesStore } from '../store/english-exercises.store';
import { EnglishExercisesService } from '../services/english-exercises.service';
import { MatDialog } from '@angular/material/dialog';
import { EnglishExerciseFormComponent } from '../english-exercise-form/english-exercise-form.component';
@Component({
  selector: 'app-english-exercises-list',
  imports: [
    MatIconModule, MatTableModule,MatButtonModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSortModule,

  ],
  templateUrl: './english-exercises-list.component.html',
  styleUrl: './english-exercises-list.component.css',
})
export class EnglishExercisesListComponent implements OnInit{
  store = inject(EnglishExercisesStore);
  exerciseService = inject(EnglishExercisesService);
  nbExercises = this.store.totalExercises;

  dataSource = new MatTableDataSource<EnglishExercise>();

  displayedColumns: string[] = ['Id','title', 'description', 'category', 'duration', 'current_status', 'score', 'comment'];

  exercisesDataArray: EnglishExercise[] = [];

  /* modals dialog */
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.loadEnglishExercises().then(() => {
      this.exercisesDataArray = this.store.Exercises();
      this.dataSource = new MatTableDataSource<EnglishExercise>(this.exercisesDataArray);
    })
  }

  async loadEnglishExercises() {
    await this.store.loadExercises()
  }

  openDialog(): void {
    this.dialog.open(EnglishExerciseFormComponent, {
      height: '480px',
      width: '620px',
      data: undefined
    })
  }
}
