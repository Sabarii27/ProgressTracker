import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Habit, HealthEntry, DayPerformance, Quote } from '@/types';
import { format, startOfYear, eachDayOfInterval, endOfYear } from 'date-fns';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface DataContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  toggleHabitForDate: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  getHabitStreak: (habit: Habit) => number;
  healthEntries: HealthEntry[];
  updateHealthEntry: (entry: HealthEntry) => void;
  getTodayHealth: () => HealthEntry | undefined;
  getDayPerformance: (date: string) => DayPerformance;
  getYearPerformance: () => DayPerformance[];
  dailyQuote: Quote;
  today: string;
}

const quotes: Quote[] = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [dailyQuote] = useState<Quote>(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  });

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setHabits([]);
      setHealthEntries([]);
      return;
    }
    const uid = user.uid;
    const tasksRef = collection(db, 'users', uid, 'tasks');
    const habitsRef = collection(db, 'users', uid, 'habits');
    const healthRef = collection(db, 'users', uid, 'health');

    const unsubTasks = onSnapshot(tasksRef, snap => {
      setTasks(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Task));
    });
    const unsubHabits = onSnapshot(habitsRef, snap => {
      setHabits(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Habit));
    });
    const unsubHealth = onSnapshot(healthRef, snap => {
      setHealthEntries(snap.docs.map(doc => doc.data() as HealthEntry));
    });
    return () => {
      unsubTasks();
      unsubHabits();
      unsubHealth();
    };
  }, [user]);

  // Task CRUD
  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!user) return;
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    await setDoc(doc(db, 'users', user.uid, 'tasks', newTask.id), newTask);
  };
  const toggleTask = async (id: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'tasks', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as Task;
      await updateDoc(ref, {
        completed: !data.completed,
        completedAt: !data.completed ? new Date().toISOString() : null,
      });
    }
  };
  const deleteTask = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'tasks', id));
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => {
    if (!user) return;
    const newHabit: Habit = {
      ...habit,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    await setDoc(doc(db, 'users', user.uid, 'habits', newHabit.id), newHabit);
  };

  const toggleHabitForDate = async (id: string, date: string) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'habits', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as Habit;
      const completedDates = data.completedDates.includes(date)
        ? data.completedDates.filter(d => d !== date)
        : [...data.completedDates, date];
      await updateDoc(ref, { completedDates });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'habits', id));
  };

  const getHabitStreak = (habit: Habit) => {
    let streak = 0;
    let day = today;
    while (habit.completedDates.includes(day)) {
      streak++;
      day = format(new Date(new Date(day).getTime() - 86400000), 'yyyy-MM-dd');
    }
    return streak;
  };

  const updateHealthEntry = async (entry: HealthEntry) => {
    if (!user) return;
    const entryToSave = {
      ...entry,
      mood: entry.mood !== undefined && entry.mood !== null ? entry.mood : "",
      steps: entry.steps !== undefined && entry.steps !== null ? entry.steps : 0,
      waterIntake: entry.waterIntake !== undefined && entry.waterIntake !== null ? entry.waterIntake : 0,
      sleepHours: entry.sleepHours !== undefined && entry.sleepHours !== null ? entry.sleepHours : 0,
      workoutMinutes: entry.workoutMinutes !== undefined && entry.workoutMinutes !== null ? entry.workoutMinutes : 0,
    };
    await setDoc(doc(db, 'users', user.uid, 'health', entry.date), entryToSave);
  };

  const getTodayHealth = () => healthEntries.find(e => e.date === today);

  const getDayPerformance = (date: string): DayPerformance => {
    const habitsCompleted = habits.filter(h => h.completedDates.includes(date)).length;
    const totalHabits = habits.length;
    const healthScore = 0; // You can calculate based on healthEntries
    return { date, tasksCompleted: 0, totalTasks: 0, habitsCompleted, totalHabits, healthScore };
  };

  const getYearPerformance = (): DayPerformance[] => {
    const days = eachDayOfInterval({ start: startOfYear(new Date()), end: endOfYear(new Date()) });
    return days.map(day => getDayPerformance(format(day, 'yyyy-MM-dd')));
  };

  return (
    <DataContext.Provider value={{
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      habits,
      addHabit,
      toggleHabitForDate,
      deleteHabit,
      getHabitStreak,
      healthEntries,
      updateHealthEntry,
      getTodayHealth,
      getDayPerformance,
      getYearPerformance,
      dailyQuote,
      today,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
