import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  success: 'gradient-success text-success-foreground',
  warning: 'bg-warning/10 border-warning/20',
  accent: 'gradient-accent text-accent-foreground',
};

export function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  const isPrimary = variant === 'primary' || variant === 'success' || variant === 'accent';
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-soft hover:-translate-y-1",
      variantStyles[variant]
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              isPrimary ? "opacity-90" : "text-muted-foreground"
            )}>
              {title}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-display font-bold">{value}</span>
              {trend && (
                <span className={cn(
                  "text-sm font-medium mb-1",
                  trend.positive 
                    ? isPrimary ? "opacity-90" : "text-success" 
                    : isPrimary ? "opacity-90" : "text-destructive"
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className={cn(
                "text-sm",
                isPrimary ? "opacity-80" : "text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            isPrimary ? "bg-foreground/10" : "bg-primary/10"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
