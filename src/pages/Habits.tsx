import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { Plus, Flame, Trash2, Check } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const habitIcons = ['🏃', '📚', '🧘', '💪', '🎯', '✍️', '🥗', '💧', '😴', '📵', '🎨', '🎵'];

export default function Habits() {
  const isMobile = useIsMobile();
  const { habits, addHabit, toggleHabitForDate, deleteHabit, getHabitStreak, today } = useData();
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100) 
    : 0;

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit({
      name: newHabitName,
      icon: selectedIcon,
      color: 'hsl(var(--primary))',
    });
    setNewHabitName('');
    setSelectedIcon('🎯');
  };

  // Get last 7 days for weekly view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date,
      dateStr: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === today,
    };
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          Habits
        </h1>
        <p className="text-muted-foreground">
          {completedToday} of {habits.length} habits completed today
        </p>
      </div>

      {/* Progress */}
      <Card className="gradient-primary text-primary-foreground overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Today's Habit Score</p>
              <p className="text-4xl font-display font-bold">{completionRate}%</p>
            </div>
            <div className="text-6xl opacity-20">🎯</div>
          </div>
        </CardContent>
      </Card>

      {/* Add Habit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative">
              <Button
                variant="outline"
                size="lg"
                className="text-2xl w-14 h-14"
                onClick={() => setShowIconPicker(!showIconPicker)}
              >
                {selectedIcon}
              </Button>
              {showIconPicker && (
                <div className="absolute top-full mt-2 left-0 z-10 bg-card border rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 animate-scale-in">
                  {habitIcons.map((icon) => (
                    <button
                      key={icon}
                      className={cn(
                        "w-10 h-10 rounded-lg text-xl hover:bg-secondary transition-colors",
                        selectedIcon === icon && "bg-primary/10"
                      )}
                      onClick={() => {
                        setSelectedIcon(icon);
                        setShowIconPicker(false);
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input
              placeholder="Habit name (e.g., Morning Exercise)"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
              className="text-base flex-1"
            />
            <Button onClick={handleAddHabit} className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview Header */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <div className="w-[200px] shrink-0" />
        {weekDays.map((day) => (
          <div
            key={day.dateStr}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-14 rounded-xl shrink-0",
              day.isToday ? "bg-primary text-primary-foreground" : "bg-secondary"
            )}
          >
            <span className="text-xs font-medium opacity-70">{day.dayName}</span>
            <span className="text-lg font-bold">{day.dayNum}</span>
          </div>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No habits yet. Create your first habit above!</p>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => {
            const streak = getHabitStreak(habit);
            
            return (
              <Card key={habit.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-[200px] shrink-0 flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{habit.name}</p>
                        {streak > 0 && (
                          <div className="flex items-center gap-1 text-accent">
                            <Flame className="w-3.5 h-3.5" />
                            <span className="text-sm font-bold">{streak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={isMobile ? "flex flex-col gap-2 flex-1" : "flex gap-2 flex-1"}>
                      {weekDays.map((day) => {
                        if (!day.isToday) return null;
                        const isCompleted = habit.completedDates.includes(day.dateStr);
                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => toggleHabitForDate(habit.id, day.dateStr)}
                            className={cn(
                              isMobile
                                ? "w-10 h-10 rounded-lg flex items-center justify-center text-base"
                                : "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0",
                              isCompleted 
                                ? "bg-success text-success-foreground shadow-sm" 
                                : "bg-secondary hover:bg-primary/10"
                            )}
                            disabled={isCompleted}
                          >
                            {isCompleted ? <Check className={isMobile ? "w-4 h-4" : "w-5 h-5"} /> : 'Complete'}
                          </button>
                        );
                      })}
                      {isMobile && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                          className="w-full mt-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      )}
                    </div>
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteHabit(habit.id)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
