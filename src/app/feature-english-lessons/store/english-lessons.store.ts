import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { EnglishLessonsService } from '../services/english-lessons.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { EnglishLesson } from '../models/english-lesson.model';
import { firstValueFrom, pipe, switchMap, tap } from 'rxjs';

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
  ({ providedIn: 'root'}),
  withState(initialState),
  withComputed(({ lessons, error }) => ({
    lessonCount: computed(() => lessons().length),
    hasError: computed(() => error !== null)
  })),
  withMethods((store, englishLessonsService = inject(EnglishLessonsService)) => ({

    loadEnglishLessons: async() => {
      patchState(store, {isLoading: true})

      const lessons = await firstValueFrom(englishLessonsService.getEnglishLessons())

      patchState(store, { lessons, isLoading: false})
    }

  })),
  withHooks(store => ({

  }))
);
