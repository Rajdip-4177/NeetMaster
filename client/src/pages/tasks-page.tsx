import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import TaskList from "@/components/task/task-list";
import TaskForm from "@/components/task/task-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Handle task deletion
  const handleDeleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  // Handle editing task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    switch (activeTab) {
      case "pending":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  // Close dialog and reset editing task
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: number; completed: boolean }) => {
      await apiRequest("PUT", `/api/tasks/${taskId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Handle toggling task completion
  const handleToggleTaskCompletion = (taskId: number, completed: boolean) => {
    toggleTaskMutation.mutate({ taskId, completed: !completed });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-primary text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-heading font-semibold">Your Study Tasks</h2>
            <Button 
              className="bg-white text-primary hover:bg-gray-100 transition-colors"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 border-b w-full justify-start rounded-none bg-transparent border-border space-x-8">
              <TabsTrigger 
                value="all" 
                className={`pb-2 ${activeTab === "all" ? "border-b-2 border-primary" : ""}`}
              >
                All Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className={`pb-2 ${activeTab === "pending" ? "border-b-2 border-primary" : ""}`}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className={`pb-2 ${activeTab === "completed" ? "border-b-2 border-primary" : ""}`}
              >
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tasks && tasks.length > 0 ? (
                <TaskList 
                  tasks={getFilteredTasks()}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onToggleCompletion={handleToggleTaskCompletion}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any tasks yet.</p>
                  <Button 
                    variant="link" 
                    className="text-primary mt-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Create a new task
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : getFilteredTasks().length > 0 ? (
                <TaskList 
                  tasks={getFilteredTasks()}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onToggleCompletion={handleToggleTaskCompletion}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any pending tasks.</p>
                  <Button 
                    variant="link" 
                    className="text-primary mt-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Create a new task
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="pt-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : getFilteredTasks().length > 0 ? (
                <TaskList 
                  tasks={getFilteredTasks()}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  onToggleCompletion={handleToggleTaskCompletion}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't completed any tasks yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask 
                ? "Update your task details below." 
                : "Fill in the details for your new study task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm 
            onClose={handleCloseDialog} 
            initialTask={editingTask}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
