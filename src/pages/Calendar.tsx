import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckSquare, Repeat, Heart } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Calendar() {
  const { getDayPerformance, tasks, habits, healthEntries, today } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOffset = getDay(monthStart);

  const getPerformanceLevel = (dateStr: string) => {
    const perf = getDayPerformance(dateStr);
    const taskScore = perf.totalTasks > 0 ? (perf.tasksCompleted / perf.totalTasks) * 33 : 0;
    const habitScore = perf.totalHabits > 0 ? (perf.habitsCompleted / perf.totalHabits) * 33 : 0;
    const healthPart = perf.healthScore * 0.34;
    const total = taskScore + habitScore + healthPart;
    
    if (total === 0) return 'empty';
    if (total >= 80) return 'excellent';
    if (total >= 60) return 'good';
    if (total >= 40) return 'medium';
    return 'poor';
  };

  const levelColors = {
    empty: 'bg-secondary hover:bg-secondary/80',
    excellent: 'bg-calendar-excellent text-white',
    good: 'bg-calendar-good text-white',
    medium: 'bg-calendar-medium text-foreground',
    poor: 'bg-calendar-poor text-white',
  };

  const selectedPerformance = selectedDate ? getDayPerformance(selectedDate) : null;
  const selectedDayTasks = selectedDate 
    ? tasks.filter(t => t.createdAt.startsWith(selectedDate))
    : [];
  const selectedDayHabits = selectedDate 
    ? habits.filter(h => h.completedDates.includes(selectedDate))
    : [];
  const selectedHealth = selectedDate 
    ? healthEntries.find(e => e.date === selectedDate)
    : null;

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          Calendar
        </h1>
        <p className="text-muted-foreground">
          View your progress across the year
        </p>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-calendar-excellent" />
              <span className="text-sm">Excellent (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-calendar-good" />
              <span className="text-sm">Good (60-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-calendar-medium" />
              <span className="text-sm">Medium (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-calendar-poor" />
              <span className="text-sm">Needs Work (&lt;40%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: startDayOffset }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days */}
              {monthDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                const level = getPerformanceLevel(dateStr);
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
                      levelColors[level],
                      isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      isSelected && "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? format(new Date(selectedDate), 'EEEE, MMMM d')
                : 'Select a day'
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPerformance ? (
              <>
                {/* Tasks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-sm font-medium">Tasks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-bold">
                      {selectedPerformance.tasksCompleted}/{selectedPerformance.totalTasks}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedPerformance.totalTasks > 0 
                        ? Math.round((selectedPerformance.tasksCompleted / selectedPerformance.totalTasks) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                  {selectedDayTasks.length > 0 && (
                    <div className="space-y-1">
                      {selectedDayTasks.slice(0, 3).map((task) => (
                        <div 
                          key={task.id}
                          className={cn(
                            "text-sm px-2 py-1 rounded",
                            task.completed ? "bg-success/10 text-success line-through" : "bg-secondary"
                          )}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Habits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Repeat className="w-4 h-4" />
                    <span className="text-sm font-medium">Habits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-bold">
                      {selectedPerformance.habitsCompleted}/{selectedPerformance.totalHabits}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedPerformance.totalHabits > 0 
                        ? Math.round((selectedPerformance.habitsCompleted / selectedPerformance.totalHabits) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                  {selectedDayHabits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedDayHabits.map((habit) => (
                        <span 
                          key={habit.id}
                          className="text-lg"
                          title={habit.name}
                        >
                          {habit.icon}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Health */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Health Score</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-bold">
                      {selectedPerformance.healthScore}%
                    </span>
                  </div>
                  {selectedHealth && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedHealth.steps && (
                        <div className="bg-secondary rounded px-2 py-1">
                          🚶 {selectedHealth.steps.toLocaleString()} steps
                        </div>
                      )}
                      {selectedHealth.waterIntake && (
                        <div className="bg-secondary rounded px-2 py-1">
                          💧 {selectedHealth.waterIntake} glasses
                        </div>
                      )}
                      {selectedHealth.sleepHours && (
                        <div className="bg-secondary rounded px-2 py-1">
                          😴 {selectedHealth.sleepHours}h sleep
                        </div>
                      )}
                      {selectedHealth.workoutMinutes && (
                        <div className="bg-secondary rounded px-2 py-1">
                          💪 {selectedHealth.workoutMinutes}min workout
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Click on a day to see details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
