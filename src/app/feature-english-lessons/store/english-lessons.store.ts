import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { EnglishLessonsService } from '../services/english-lessons.service';
import { computed, inject } from '@angular/core';
import { EnglishLesson } from '../models/english-lesson.model';
import { firstValueFrom } from 'rxjs';

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
      patchState(store, { isLoading: true });
      try {
        const lessons = await firstValueFrom(englishLessonsService.getEnglishLessons());
        patchState(store, { lessons, isLoading: false, error: null });
      } catch (err) {
        patchState(store, { isLoading: false, error: 'Error loading lessons.' });
      }
    },

    addEnglishLesson: async (newLesson: EnglishLesson) => {
      patchState(store, { isLoading: true });
      try {
        // 1.
        const createdLesson = await firstValueFrom(englishLessonsService.createEnglishLesson(newLesson));

        // 2.
        patchState(store, {
          lessons: [...store.lessons(), createdLesson],
          isLoading: false,
          error: null
        });
      } catch (err) {
        patchState(store, {
          isLoading: false,
          error: "Error adding lesson."
        });
      }
    },

    updateEnglishLesson: async (id: string, updatedData: EnglishLesson) => {
      patchState(store, { isLoading: true });
      try {
        // 1.
        const updatedLesson = await firstValueFrom(englishLessonsService.updateEnglishLesson(id, updatedData));

        // 2.
        patchState(store, {
          // Replace the old version of the lesson with the updated version in the table
          lessons: store.lessons().map(lesson => lesson.id === id ? updatedLesson : lesson),
          // selectedLesson updated in the store
          selectedLesson: updatedLesson,
          isLoading: false,
          error: null
        });
      } catch (err) {
        patchState(store, {
          isLoading: false,
          error: "Error updating lesson."
        });
      }
    },

    // method for select manually a lesson (click on the list)
    selectLesson: (lesson: EnglishLesson) => {
      patchState(store, { selectedLesson: lesson });
    },

    deleteLesson: async (id: string) => {
      patchState(store, { isLoading: true });
      try {
        // 1.
        await firstValueFrom(englishLessonsService.deleteEnglishLesson(id));

        // 2.
        patchState(store, {
          lessons: store.lessons().filter(lesson => lesson.id !== id),
          isLoading: false,
          error: null
        });
      } catch (err) {
        patchState(store, {
          isLoading: false,
          error: "Error deleting lesson."
        });
      }
    }

  })),
  withHooks(store => ({
    onInit: async () => { await store.loadEnglishLessons(); }
  }))
);
