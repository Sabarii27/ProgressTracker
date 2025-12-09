import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category, Priority } from '@/types';

const categoryEmojis: Record<Category, string> = {
  study: '📚',
  work: '💼',
  personal: '🏠',
  fitness: '💪',
};

const priorityColors = {
  low: 'border-success',
  medium: 'border-warning',
  high: 'border-destructive',
};

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask, today } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState<Category>('personal');

  const todayTasks = tasks.filter(t => t.createdAt.startsWith(today));
  const completedCount = todayTasks.filter(t => t.completed).length;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
    });
    setNewTaskTitle('');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Input/selects and Add Task button below */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-2">
        <Input
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
        />
        <select
          value={newTaskPriority}
          onChange={e => setNewTaskPriority(e.target.value as Priority)}
          className="border rounded px-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={newTaskCategory}
          onChange={e => setNewTaskCategory(e.target.value as Category)}
          className="border rounded px-2"
        >
          <option value="personal">Personal</option>
          <option value="study">Study</option>
          <option value="work">Work</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>
      <Button onClick={handleAddTask} variant="success" className="w-full mb-4">
        Add Task
      </Button>
      <div className="mb-4 text-sm text-muted-foreground">
        {completedCount} of {todayTasks.length} completed
      </div>
      <ul className="space-y-2">
        {todayTasks.map(task => (
          <li key={task.id} className={cn(
            'flex items-center gap-2 p-2 rounded border',
            priorityColors[task.priority]
          )}>
            <span className="text-xl">{categoryEmojis[task.category]}</span>
            <span className={cn('flex-1', task.completed && 'line-through text-muted-foreground')}>{task.title}</span>
            <Button size="icon" variant={task.completed ? 'success' : 'outline'} onClick={() => toggleTask(task.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="destructive" onClick={() => deleteTask(task.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
