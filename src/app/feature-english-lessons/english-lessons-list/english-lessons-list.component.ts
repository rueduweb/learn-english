import { inject, AfterViewInit, Component, ViewChild, effect, OnInit, signal } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { EnglishLesson } from '../models/english-lesson.model';
import { EnglishLessonsStore } from '../store/english-lessons.store';
import { EnglishLessonsService } from '../services/english-lessons.service';

import { MatDialog } from '@angular/material/dialog';
import { EnglishLessonFormComponent } from '../english-lesson-form/english-lesson-form.component';
import { patchState } from '@ngrx/signals';
@Component({
  selector: 'app-english-lessons-list',
  imports: [MatIconModule, MatTableModule,MatButtonModule, MatPaginatorModule, MatPaginator, MatFormFieldModule, MatInputModule],
  templateUrl: './english-lessons-list.component.html',
  styleUrl: './english-lessons-list.component.css'
})
export class EnglishLessonsListComponent implements OnInit, AfterViewInit {
  store = inject(EnglishLessonsStore);
  lessonService = inject(EnglishLessonsService);
  nbLessons = this.store.lessonCount;

  dataSource = new MatTableDataSource<EnglishLesson>();

  displayedColumns: string[] = ['Id','title', 'description', 'category', 'day', 'duration', 'current_status', 'coach', 'Group Lesson'];

  lessonsDataArray: EnglishLesson[]=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /* modal dialog */
  readonly dialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    this.loadEnglishLessons().then(() => {
      this.lessonsDataArray = this.store.lessons();
      this.dataSource = new MatTableDataSource<EnglishLesson>(this.lessonsDataArray);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async loadEnglishLessons() {
    await this.store.loadEnglishLessons()
  }

  openDialog(): void {
    this.dialog.open(EnglishLessonFormComponent, {
      height: '480px',
      width: '640px',
      data: (this.store.selectedLesson()) ? this.store.selectedLesson() : undefined
    })
  }

  updateLesson(lessonSelect: EnglishLesson) {
    if(lessonSelect) {
      //1. Update selected lesson in the store
      this.store.selectLesson(lessonSelect);
      //2. Open modal to modify the lesson
      this.openDialog();
    }
  }

  deleteLesson(id: string) {
    // TODO
  }

}
