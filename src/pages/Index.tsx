import { format } from 'date-fns';
import { CheckSquare, TrendingUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuoteCard } from '@/components/dashboard/QuoteCard';
import { TaskSummary } from '@/components/dashboard/TaskSummary';
import { HabitSummary } from '@/components/dashboard/HabitSummary';
import { HealthSummary } from '@/components/dashboard/HealthSummary';
import { WeeklyTaskChart } from '@/components/charts/WeeklyTaskChart';
import { HabitTrendChart } from '@/components/charts/HabitTrendChart';
import { YearCalendar } from '@/components/charts/YearCalendar';

const Index = () => {
  const { tasks, habits, getTodayHealth, today, getDayPerformance } = useData();

  const todayTasks = tasks.filter(t => t.createdAt.startsWith(today));
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const habitsCompletedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const health = getTodayHealth();
  const performance = getDayPerformance(today);

  const overallScore = Math.round(
    (todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 33 : 0) +
    (habits.length > 0 ? (habitsCompletedToday / habits.length) * 33 : 0) +
    (performance.healthScore * 0.34)
  );

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quote */}
      <QuoteCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Score"
          value={`${overallScore}%`}
          subtitle="Overall progress"
          icon={<TrendingUp className="w-6 h-6 text-primary-foreground" />}
          variant="primary"
        />
        <StatCard
          title="Tasks Done"
          value={completedTasks}
          subtitle={`of ${todayTasks.length} tasks`}
          icon={<CheckSquare className="w-6 h-6 text-primary" />}
          trend={{ value: 15, positive: true }}
        />
        <StatCard
          title="Habits Done"
          value={habitsCompletedToday}
          subtitle={`of ${habits.length} habits`}
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          trend={{ value: habitsCompletedToday, positive: true }}
        />
      </div>

      {/* Task Summary */}
      <TaskSummary />
      {/* Habit Summary */}
      <HabitSummary />
      {/* Health Summary */}
      <HealthSummary />
      {/* Weekly Task Chart */}
      <WeeklyTaskChart />
      {/* Habit Trend Chart */}
      <HabitTrendChart />
      {/* Year Calendar */}
      <YearCalendar />
    </div>
  );
};

export default Index;
