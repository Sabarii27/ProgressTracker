import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { format, startOfYear, eachDayOfInterval, endOfYear, isSameMonth, getDay, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function YearCalendar() {
  const { getYearPerformance } = useData();
  const yearPerformance = getYearPerformance();
  const year = new Date().getFullYear();
  
  const getPerformanceLevel = (day: { tasksCompleted: number; totalTasks: number; habitsCompleted: number; totalHabits: number; healthScore: number }) => {
    const taskScore = day.totalTasks > 0 ? (day.tasksCompleted / day.totalTasks) * 33 : 0;
    const habitScore = day.totalHabits > 0 ? (day.habitsCompleted / day.totalHabits) * 33 : 0;
    const healthPart = day.healthScore * 0.34;
    const total = taskScore + habitScore + healthPart;
    
    if (total === 0) return 'empty';
    if (total >= 80) return 'excellent';
    if (total >= 60) return 'good';
    if (total >= 40) return 'medium';
    return 'poor';
  };

  const levelColors = {
    empty: 'bg-calendar-empty',
    excellent: 'bg-calendar-excellent',
    good: 'bg-calendar-good',
    medium: 'bg-calendar-medium',
    poor: 'bg-calendar-poor',
  };

  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{year} Overview</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <span className="text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {(['empty', 'poor', 'medium', 'good', 'excellent'] as const).map((level) => (
                <div key={level} className={cn("w-3 h-3 rounded-sm", levelColors[level])} />
              ))}
            </div>
            <span className="text-muted-foreground">More</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-fit">
            {months.map((month, monthIndex) => {
              const monthDays = eachDayOfInterval({
                start: month,
                end: new Date(year, monthIndex + 1, 0),
              });
              
              const firstDayOffset = getDay(month);
              const weeks: (typeof yearPerformance[0] | null)[][] = [];
              let currentWeek: (typeof yearPerformance[0] | null)[] = Array(firstDayOffset).fill(null);
              
              monthDays.forEach((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const perf = yearPerformance.find(p => p.date === dateStr);
                currentWeek.push(perf || null);
                
                if (currentWeek.length === 7) {
                  weeks.push(currentWeek);
                  currentWeek = [];
                }
              });
              
              if (currentWeek.length > 0) {
                while (currentWeek.length < 7) {
                  currentWeek.push(null);
                }
                weeks.push(currentWeek);
              }

              return (
                <div key={monthIndex} className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {format(month, 'MMM')}
                  </p>
                  <div className="flex flex-col gap-[2px]">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex gap-[2px]">
                        {week.map((day, dayIndex) => {
                          if (!day) {
                            return <div key={dayIndex} className="w-3 h-3" />;
                          }
                          
                          const level = getPerformanceLevel(day);
                          const dateObj = new Date(day.date);
                          
                          return (
                            <Tooltip key={dayIndex}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50",
                                    levelColors[level]
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <p className="font-medium">{format(dateObj, 'MMM d, yyyy')}</p>
                                  <p>Tasks: {day.tasksCompleted}/{day.totalTasks}</p>
                                  <p>Habits: {day.habitsCompleted}/{day.totalHabits}</p>
                                  <p>Health: {day.healthScore}%</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
