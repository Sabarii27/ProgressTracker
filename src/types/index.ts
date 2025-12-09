export type Priority = 'low' | 'medium' | 'high';
export type Category = 'study' | 'work' | 'personal' | 'fitness';
export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
  createdAt: string;
}

export interface HealthEntry {
  date: string;
  weight?: number;
  steps?: number;
  waterIntake?: number;
  workoutMinutes?: number;
  sleepHours?: number;
  mood?: Mood;
}

export interface DayPerformance {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  habitsCompleted: number;
  totalHabits: number;
  healthScore: number;
}

export interface Quote {
  text: string;
  author: string;
}
