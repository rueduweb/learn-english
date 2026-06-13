import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { EnglishExercise } from '../../shared/models/english-item.model';
import { EnglishExercisesStore } from '../store/english-exercises.store';
import { EnglishExercisesService } from '../services/english-exercises.service';
import { MatDialog } from '@angular/material/dialog';
import { EnglishExerciseFormComponent } from '../english-exercise-form/english-exercise-form.component';
import { CustomDateFormatPipe } from "../../pipes/custom-date-format.pipe";
@Component({
  selector: 'app-english-exercises-list',
  imports: [
    MatIconModule, MatTableModule, MatButtonModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSortModule,
    CustomDateFormatPipe
  ],
  templateUrl: './english-exercises-list.component.html',
  styleUrl: './english-exercises-list.component.css',
})
export class EnglishExercisesListComponent implements OnInit{
  store = inject(EnglishExercisesStore);
  exerciseService = inject(EnglishExercisesService);
  nbExercises = this.store.totalExercises;

  dataSource = new MatTableDataSource<EnglishExercise>();

  displayedColumns: string[] = ['Id', 'title', 'description', 'category', 'duration', 'current_status', 'score', 'day', 'comment'];

  exercisesDataArray: EnglishExercise[] = [];

  displayedColumnsFilter: string[] = ['f-id', 'f-title', 'f-description', 'f-category', 'f-duration', 'f-current_status', 'f-score', 'f-day', 'f-comment'];

  filterValues = {id: '', title: '', description: '', category:'', duration:'', current_status:'', score:'', day:'', comment:''};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /* modals dialog */
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.loadEnglishExercises().then(() => {
      this.exercisesDataArray = this.store.Exercises();
      this.dataSource = new MatTableDataSource<EnglishExercise>(this.exercisesDataArray);
      this.dataSource.filterPredicate = this.customFilterPrediction();
      this.dataSource._orderData(this.exercisesDataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  async loadEnglishExercises() {
    await this.store.loadExercises()
  }

  openDialog(): void {
    this.dialog.open(EnglishExerciseFormComponent, {
      height: '480px',
      width: '640px',
      data: undefined
    })
  }

  // Custom manage column filters
  filterChange(columnName: string, element: any) {
    if(columnName==='id' || columnName==='title' || columnName==='description' || columnName==='duration' ||
      columnName==='day' || columnName==='category' || columnName==='current_status' || columnName==='score' ||
      columnName==='comment'
    ){
			this.filterValues[columnName]= element.target.value.trim().toLowerCase();
			this.dataSource.filter = JSON.stringify(this.filterValues);
		}
  }

  customFilterPrediction() {
      const filterPrediction = (data: EnglishExercise, filterValue: string): any => {
        let searchTerm = JSON.parse(filterValue);
        if(data.id && data.score && data.comment) {
          return data.id.toString().trim().toLowerCase().indexOf(searchTerm.id.toLowerCase()) !== -1 &&
          data.title.toString().trim().toLowerCase().indexOf(searchTerm.title.toLowerCase()) !== -1 &&
          data.description.toString().trim().toLowerCase().indexOf(searchTerm.description.toLowerCase()) !== -1 &&
          data.category.toString().trim().toLowerCase().indexOf(searchTerm.category.toLowerCase()) !== -1 &&
          data.duration.toString().trim().toLowerCase().indexOf(searchTerm.duration.toLowerCase()) !== -1 &&
          data.current_status.toString().trim().toLowerCase().indexOf(searchTerm.current_status.toLowerCase()) !== -1 &&
          data.score.toString().trim().toLowerCase().indexOf(searchTerm.score.toLowerCase()) !== -1 &&
          data.day.toString().trim().toLowerCase().indexOf(searchTerm.day.toLowerCase()) !== -1 &&
          data.comment.toString().trim().toLowerCase().indexOf(searchTerm.comment.toLowerCase()) !== -1
        }

      }
      return filterPrediction;
    }
}
