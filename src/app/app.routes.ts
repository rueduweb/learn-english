import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EnglishLessonsListComponent } from '../app/feature-english-lessons/english-lessons-list/english-lessons-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'lessons', component: EnglishLessonsListComponent },
  { path: '**', component: PageNotFoundComponent },
];

