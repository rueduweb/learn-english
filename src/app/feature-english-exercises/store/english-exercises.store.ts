import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  withHooks
} from '@ngrx/signals';

import {
  computed,
  inject
} from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { EnglishExercisesService } from '../services/english-exercises.service';
import { EnglishExercise } from '../../shared/models/english-item.model';

type EnglishExercisesState = {
  Exercises: EnglishExercise[];
  isLoading: boolean;
  error: string | null;
  selectedExercise: EnglishExercise | null;
};

const initialState: EnglishExercisesState = {
  Exercises: [],
  isLoading: false,
  error: null,
  selectedExercise: null,
};

export const EnglishExercisesStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    totalExercises: computed(() => store.Exercises().length),

    hasExercises: computed(() => store.Exercises().length > 0),

    selectedExerciseId: computed(
      () => store.selectedExercise()?.id ?? null
    ),
  })),

  withMethods((store, englishExercisesService = inject(EnglishExercisesService)) => {

    return {

      async loadExercises(): Promise<void> {
        patchState(store, {
          isLoading: true,
          error: null,
        });

        try {
          const Exercises = await firstValueFrom(
            englishExercisesService.getEnglishExercises()
          );

          patchState(store, {
            Exercises,
            isLoading: false,
          });
        } catch (error) {
          patchState(store, {
            isLoading: false,
            error: 'Error loading exercises',
          });
        }
      },

      async create(Exercise: EnglishExercise): Promise<void> {
        patchState(store, {
          isLoading: true,
          error: null,
        });

        try {
          const created = await firstValueFrom(
            englishExercisesService.createEnglishExercise(Exercise)
          );

          patchState(store, (state) => ({
            Exercises: [...state.Exercises, created],
            isLoading: false,
          }));
        } catch {
          patchState(store, {
            isLoading: false,
            error: 'Erreur lors de la création',
          });
        }
      },

      async update(id: string, Exercise: EnglishExercise): Promise<void> {
        patchState(store, {
          isLoading: true,
          error: null,
        });

        try {
          const updated = await firstValueFrom(
            englishExercisesService.updateEnglishExercise(id, Exercise)
          );

          patchState(store, (state) => ({
            Exercises: state.Exercises.map((item) =>
              item.id === id ? updated : item
            ),
            selectedExercise:
              state.selectedExercise?.id === id
                ? updated
                : state.selectedExercise,
            isLoading: false,
          }));
        } catch {
          patchState(store, {
            isLoading: false,
            error: 'Erreur lors de la modification',
          });
        }
      },

      async delete(id: string): Promise<void> {
        patchState(store, {
          isLoading: true,
          error: null,
        });

        try {
          await firstValueFrom(
            englishExercisesService.deleteEnglishExercise(id)
          );

          patchState(store, (state) => ({
            Exercises: state.Exercises.filter(
              (item) => item.id !== id
            ),
            selectedExercise:
              state.selectedExercise?.id === id
                ? null
                : state.selectedExercise,
            isLoading: false,
          }));
        } catch {
          patchState(store, {
            isLoading: false,
            error: 'Erreur lors de la suppression',
          });
        }
      },

      selectExercise(Exercise: EnglishExercise | null): void {
        patchState(store, {
          selectedExercise: Exercise,
        });
      },

      clearSelection(): void {
        patchState(store, {
          selectedExercise: null,
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      store.loadExercises();
    },
  })
);
