import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Check, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const priorityColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

const categoryEmojis = {
  study: '📚',
  work: '💼',
  personal: '🏠',
  fitness: '💪',
};

export function TaskSummary() {
  const { tasks, toggleTask, today } = useData();
  
  const todayTasks = tasks.filter(t => t.createdAt.startsWith(today));
  const completedCount = todayTasks.filter(t => t.completed).length;
  const completionRate = todayTasks.length > 0 
    ? Math.round((completedCount / todayTasks.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Today's Tasks</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} of {todayTasks.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-display font-bold text-primary">
            {completionRate}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tasks for today yet</p>
            <Button asChild variant="outline">
              <Link to="/tasks">Add your first task</Link>
            </Button>
          </div>
        ) : (
          <>
            {todayTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  task.completed ? "bg-success/5 border-success/20" : "bg-card border-border hover:border-primary/30"
                )}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    task.completed 
                      ? "bg-success border-success text-success-foreground" 
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                </div>
                <span className="text-lg">{categoryEmojis[task.category]}</span>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full border",
                  priorityColors[task.priority]
                )}>
                  {task.priority}
                </span>
              </div>
            ))}
            {todayTasks.length > 4 && (
              <Button asChild variant="ghost" className="w-full">
                <Link to="/tasks" className="flex items-center gap-2">
                  View all {todayTasks.length} tasks
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
