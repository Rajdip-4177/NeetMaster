import { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
  onToggleCompletion: (taskId: number, completed: boolean) => void;
}

export default function TaskItem({ task, onDelete, onEdit, onToggleCompletion }: TaskItemProps) {
  // Get priority color class
  const getPriorityClass = () => {
    switch (task.priority) {
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-blue-100 text-blue-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  // Format due date
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    return format(date, "MMM dd, yyyy");
  };
  
  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  return (
    <div 
      className={`
        border rounded-lg p-4 hover:shadow-md transition-shadow
        ${task.completed ? 'bg-gray-50' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Checkbox 
              className="mr-3 h-5 w-5"
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id, task.completed)}
            />
            <h3 
              className={`text-lg font-medium ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p 
              className={`text-gray-600 mb-2 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.description}
            </p>
          )}
          
          <div className="flex text-sm text-gray-500 flex-wrap gap-2">
            {task.dueDate && (
              <span 
                className={`flex items-center ${
                  isOverdue() ? 'text-red-500 font-medium' : ''
                }`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Due: {formatDueDate(task.dueDate)}
                {isOverdue() && " (Overdue)"}
              </span>
            )}
            
            <span 
              className={`inline-block px-2 py-1 rounded-full text-xs ${getPriorityClass()}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            
            {task.completed && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Completed
              </span>
            )}
          </div>
        </div>
        
        <div className="flex ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-primary mr-1 h-8 w-8 p-0"
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
