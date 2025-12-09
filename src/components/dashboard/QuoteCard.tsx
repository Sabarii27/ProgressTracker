import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

export function QuoteCard() {
  const { dailyQuote } = useData();

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border-primary/10">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-soft">
              <Quote className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium leading-relaxed text-foreground">
              "{dailyQuote.text}"
            </p>
            <p className="text-sm text-muted-foreground">
              — {dailyQuote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
