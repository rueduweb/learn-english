export type EnglishInfoBase = {
  id: string | undefined,
  title: string;
  description: string;
  category: string;
  day: Date;
  duration: number;
  current_status: string;
};

export type EnglishLesson = EnglishInfoBase & {
  coach: string;
  groupLesson: boolean;
};

export type EnglishExercise = EnglishInfoBase & {
  score: string | undefined;
  comment: string | undefined;
};
