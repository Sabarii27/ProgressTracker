import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Footprints, Droplets, Moon, Dumbbell, Scale, Smile, Save } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Mood } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'bad', emoji: '😔', label: 'Bad' },
  { value: 'terrible', emoji: '😢', label: 'Terrible' },
];

export default function Health() {
  const { healthEntries, updateHealthEntry, getTodayHealth, today } = useData();
  
  const currentHealth = getTodayHealth();
  
  const [weight, setWeight] = useState(currentHealth?.weight?.toString() || '');
  const [steps, setSteps] = useState(currentHealth?.steps?.toString() || '');
  const [waterIntake, setWaterIntake] = useState(currentHealth?.waterIntake || 0);
  const [workoutMinutes, setWorkoutMinutes] = useState(currentHealth?.workoutMinutes?.toString() || '');
  const [sleepHours, setSleepHours] = useState(currentHealth?.sleepHours?.toString() || '');
  const [mood, setMood] = useState<Mood | undefined>(currentHealth?.mood);

  useEffect(() => {
    const health = getTodayHealth();
    if (health) {
      setWeight(health.weight?.toString() || '');
      setSteps(health.steps?.toString() || '');
      setWaterIntake(health.waterIntake || 0);
      setWorkoutMinutes(health.workoutMinutes?.toString() || '');
      setSleepHours(health.sleepHours?.toString() || '');
      setMood(health.mood);
    }
  }, [today]);

  const handleSave = () => {
    updateHealthEntry({
      date: today,
      weight: weight ? parseFloat(weight) : undefined,
      steps: steps ? parseInt(steps) : undefined,
      waterIntake: waterIntake || undefined,
      workoutMinutes: workoutMinutes ? parseInt(workoutMinutes) : undefined,
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
      mood,
    });
    toast.success('Health data saved!');
  };

  // Chart data - last 14 days
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = healthEntries.find(e => e.date === dateStr);
    
    return {
      date: format(date, 'MMM d'),
      weight: entry?.weight || null,
      steps: entry?.steps || 0,
      water: entry?.waterIntake || 0,
      sleep: entry?.sleepHours || 0,
      workout: entry?.workoutMinutes || 0,
    };
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
          Health & Fitness
        </h1>
        <p className="text-muted-foreground">
          Track your daily wellness metrics
        </p>
      </div>

      {/* Quick Entry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weight */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="w-5 h-5" />
              <span className="text-sm font-medium">Weight (kg)</span>
            </div>
            <Input
              type="number"
              placeholder="75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="text-2xl font-display font-bold h-14 text-center"
            />
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Footprints className="w-5 h-5" />
              <span className="text-sm font-medium">Steps</span>
            </div>
            <Input
              type="number"
              placeholder="10000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="text-2xl font-display font-bold h-14 text-center"
            />
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Moon className="w-5 h-5" />
              <span className="text-sm font-medium">Sleep (hours)</span>
            </div>
            <Input
              type="number"
              step="0.5"
              placeholder="8"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="text-2xl font-display font-bold h-14 text-center"
            />
          </CardContent>
        </Card>

        {/* Workout */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Dumbbell className="w-5 h-5" />
              <span className="text-sm font-medium">Workout (min)</span>
            </div>
            <Input
              type="number"
              placeholder="30"
              value={workoutMinutes}
              onChange={(e) => setWorkoutMinutes(e.target.value)}
              className="text-2xl font-display font-bold h-14 text-center"
            />
          </CardContent>
        </Card>

        {/* Water Intake */}
        <Card className="col-span-2 lg:col-span-2">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="w-5 h-5" />
                <span className="text-sm font-medium">Water Intake</span>
              </div>
              <span className="text-2xl font-display font-bold text-primary">
                {waterIntake}/8 glasses
              </span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 8 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setWaterIntake(i + 1)}
                  className={cn(
                    "flex-1 h-12 rounded-lg transition-all duration-200",
                    i < waterIntake 
                      ? "bg-blue-500 text-white" 
                      : "bg-secondary hover:bg-blue-500/20"
                  )}
                >
                  💧
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 justify-center">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMood(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                  mood === option.value 
                    ? "bg-primary/10 ring-2 ring-primary scale-105" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} size="lg" className="w-full gap-2">
        <Save className="w-5 h-5" />
        Save Today's Health Data
      </Button>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weight Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.filter(d => d.weight)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    unit=" kg"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Steps</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="steps" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Water Intake */}
        <Card>
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
            <CardDescription>Last 14 days (glasses)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={[0, 8]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="water" 
                    fill="hsl(200 80% 50%)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Hours</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    domain={[0, 12]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    unit="h"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone"
                    dataKey="sleep" 
                    stroke="hsl(270 70% 60%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(270 70% 60%)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
