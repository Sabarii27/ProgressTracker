import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Check, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function HabitSummary() {
  const { habits, toggleHabitForDate, getHabitStreak, today } = useData();
  
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Habits</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {completedToday} of {habits.length} done
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-display font-bold text-primary">
            {completionRate}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No habits created yet</p>
            <Button asChild variant="outline">
              <Link to="/habits">Create your first habit</Link>
            </Button>
          </div>
        ) : (
          <>
            {habits.slice(0, 4).map((habit) => {
              const isCompleted = habit.completedDates.includes(today);
              const streak = getHabitStreak(habit);
              
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                    isCompleted ? "bg-success/5 border-success/20" : "bg-card border-border hover:border-primary/30"
                  )}
                >
                  <button
                    onClick={() => toggleHabitForDate(habit.id, today)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200",
                      isCompleted 
                        ? "bg-success text-success-foreground shadow-sm" 
                        : "bg-secondary hover:bg-primary/10"
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : habit.icon}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      isCompleted && "text-success"
                    )}>
                      {habit.name}
                    </p>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 text-accent">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold text-sm">{streak}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {habits.length > 4 && (
              <Button asChild variant="ghost" className="w-full">
                <Link to="/habits" className="flex items-center gap-2">
                  View all habits
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
