import { Task } from "@shared/schema";
import TaskItem from "./task-item";

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onToggleCompletion: (taskId: number, completed: boolean) => void;
}

export default function TaskList({ tasks, onDelete, onEdit, onToggleCompletion }: TaskListProps) {
  // Sort tasks by due date (ascending) and then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date (null dates at the end)
    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
    return aPriority - bPriority;
  });
  
  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </div>
  );
}
