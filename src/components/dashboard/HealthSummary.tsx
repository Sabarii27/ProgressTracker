import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Footprints, Droplets, Moon, Dumbbell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function HealthSummary() {
  const { getTodayHealth } = useData();
  const health = getTodayHealth();

  const metrics = [
    { 
      key: 'steps', 
      label: 'Steps', 
      value: health?.steps || 0, 
      target: 10000, 
      icon: <Footprints className="w-5 h-5" />,
      unit: '',
      color: 'text-primary'
    },
    { 
      key: 'water', 
      label: 'Water', 
      value: health?.waterIntake || 0, 
      target: 8, 
      icon: <Droplets className="w-5 h-5" />,
      unit: ' glasses',
      color: 'text-blue-500'
    },
    { 
      key: 'sleep', 
      label: 'Sleep', 
      value: health?.sleepHours || 0, 
      target: 8, 
      icon: <Moon className="w-5 h-5" />,
      unit: 'h',
      color: 'text-purple-500'
    },
    { 
      key: 'workout', 
      label: 'Workout', 
      value: health?.workoutMinutes || 0, 
      target: 30, 
      icon: <Dumbbell className="w-5 h-5" />,
      unit: ' min',
      color: 'text-accent'
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Health Today</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/health" className="flex items-center gap-1">
            Update
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const percentage = Math.min((metric.value / metric.target) * 100, 100);
            
            return (
              <div
                key={metric.key}
                className="p-4 rounded-xl bg-secondary/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg bg-background", metric.color)}>
                    {metric.icon}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    / {metric.target}{metric.unit}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">
                    {metric.value.toLocaleString()}{metric.unit}
                  </p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      percentage >= 100 ? "bg-success" : "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
