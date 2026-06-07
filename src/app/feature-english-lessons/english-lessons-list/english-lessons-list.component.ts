import { inject, Component, ViewChild, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { EnglishLesson } from '../../shared/models/english-item.model';
import { EnglishLessonsStore } from '../store/english-lessons.store';
import { EnglishLessonsService } from '../services/english-lessons.service';
import { CustomDateFormatPipe } from '../../pipes/custom-date-format.pipe';
import { MatDialog } from '@angular/material/dialog';
import { EnglishLessonFormComponent } from '../english-lesson-form/english-lesson-form.component';
import { ConfirmDeleteLessonComponent } from '../confirm-delete-lesson/confirm-delete-lesson.component';
@Component({
  selector: 'app-english-lessons-list',
  imports: [
    MatIconModule, MatTableModule,MatButtonModule, MatPaginatorModule,
    MatPaginator, MatFormFieldModule, MatInputModule, MatSortModule,
    CustomDateFormatPipe
  ],
  templateUrl: './english-lessons-list.component.html',
  styleUrl: './english-lessons-list.component.css'
})
export class EnglishLessonsListComponent implements OnInit {
  store = inject(EnglishLessonsStore);
  lessonService = inject(EnglishLessonsService);
  nbLessons = this.store.lessonCount;

  dataSource = new MatTableDataSource<EnglishLesson>();

  displayedColumns: string[] = ['Id','title', 'description', 'category', 'duration', 'current_status', 'coach', 'day', 'Group Lesson'];

  lessonsDataArray: EnglishLesson[]=[];

  displayedColumnsFilter: string[] = ['f-id','f-title', 'f-description','f-category', 'f-duration', 'f-current_status', 'f-coach', 'f-day', 'f-groupLesson'];

	filterValues = {id: '', title: '', description: '', category:'', duration:'', current_status:'', coach:'', day:'', groupLesson:''}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /* modals dialog */
  readonly dialog = inject(MatDialog);
  readonly confirmDialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    this.loadEnglishLessons().then(() => {
      this.lessonsDataArray = this.store.lessons();
      this.dataSource = new MatTableDataSource<EnglishLesson>(this.lessonsDataArray);
      this.dataSource.filterPredicate = this.customFilterPrediction();
      this.dataSource._orderData(this.lessonsDataArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  async loadEnglishLessons() {
    await this.store.loadEnglishLessons()
  }

  openDialog(): void {
    this.dialog.open(EnglishLessonFormComponent, {
      height: '480px',
      width: '640px',
      data: undefined
    })
  }

  openModifyDialog(): void {
    this.dialog.open(EnglishLessonFormComponent, {
      height: '480px',
      width: '640px',
      data: this.store.selectedLesson()
    })
  }

  openConfirmDialog(lessonSelect: EnglishLesson): void {
    this.dialog.open(ConfirmDeleteLessonComponent, {
      height: '170px',
      width: '360px',
      data: (this.store.selectedLesson()) ? this.store.selectedLesson() : undefined
    })
  }

  updateLesson(lessonSelect: EnglishLesson) {
    if(lessonSelect) {
      //1. Update selected lesson in the store
      this.store.selectLesson(lessonSelect);
      //2. Open modal to modify the lesson
      this.openModifyDialog();
    }
  }

  deleteLesson(lessonSelect: EnglishLesson) {
    if(lessonSelect) {
      //1. Update selected lesson in the store
      this.store.selectLesson(lessonSelect);
      //2. Open modal to delete the lesson
      this.openConfirmDialog(lessonSelect);
    }
  }

  // Custom manage column filters
  filterChange(columnName: string, element: any) {
    if(columnName==='id' || columnName==='title' || columnName==='description' || columnName==='duration' ||
      columnName==='day' || columnName==='category' || columnName==='current_status' || columnName==='coach' ||
      columnName==='groupLesson'
    ){
			this.filterValues[columnName]= element.target.value.trim().toLowerCase();
			this.dataSource.filter = JSON.stringify(this.filterValues);
		}
  }

  customFilterPrediction() {
    const filterPrediction = (data: EnglishLesson, filterValue: string): any => {
      let searchTerm = JSON.parse(filterValue);
      if(data.id) {
        return data.id.toString().trim().toLowerCase().indexOf(searchTerm.id.toLowerCase()) !== -1 &&
        data.title.toString().trim().toLowerCase().indexOf(searchTerm.title.toLowerCase()) !== -1 &&
        data.description.toString().trim().toLowerCase().indexOf(searchTerm.description.toLowerCase()) !== -1 &&
        data.category.toString().trim().toLowerCase().indexOf(searchTerm.category.toLowerCase()) !== -1 &&
        data.day.toString().trim().toLowerCase().indexOf(searchTerm.day.toLowerCase()) !== -1 &&
        data.duration.toString().trim().toLowerCase().indexOf(searchTerm.duration.toLowerCase()) !== -1 &&
        data.current_status.toString().trim().toLowerCase().indexOf(searchTerm.current_status.toLowerCase()) !== -1 &&
        data.coach.toString().trim().toLowerCase().indexOf(searchTerm.coach.toLowerCase()) !== -1 &&
        data.groupLesson.toString().trim().toLowerCase().indexOf(searchTerm.groupLesson.toLowerCase()) !== -1
      }

    }
    return filterPrediction;
  }

}
