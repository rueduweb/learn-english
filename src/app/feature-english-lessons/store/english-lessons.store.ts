import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { EnglishLessonsService } from '../services/english-lessons.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { EnglishLesson } from '../models/english-lesson.model';
import { pipe, switchMap, tap } from 'rxjs';

type EnglishLessonsState = {
  lessons: EnglishLesson[];
  isLoading: boolean;
  error: string | null;
  selectedLesson: EnglishLesson | null;
};

const initialState: EnglishLessonsState = {
  lessons: [],
  isLoading: false,
  error: null,
  selectedLesson: null,
};

export const EnglishLessonsStore = signalStore(
  withState(initialState),
  withComputed(({ lessons, error }) => ({
    lessonCount: computed(() => lessons.length),
    hasError: computed(() => error !== null)
  })),
  withMethods((store, englishLessonsService = inject(EnglishLessonsService)) => ({
    getEnglishLessons: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return englishLessonsService.getEnglishLessons().pipe(
            tapResponse({
              next: (lessons) => patchState(store, { lessons }),
              error: (err) => { console.error(err) },
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  }))
);
