import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Task, insertTaskSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extend the task schema with client-side validation
const taskFormSchema = insertTaskSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  dueDate: z.string().refine(value => {
    if (!value) return true;
    const date = new Date(value);
    const now = new Date();
    return date >= now;
  }, "Due date must be in the future"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onClose: () => void;
  initialTask: Task | null;
}

export default function TaskForm({ onClose, initialTask }: TaskFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialTask?.title || "",
      description: initialTask?.description || "",
      dueDate: initialTask?.dueDate 
        ? new Date(initialTask.dueDate).toISOString().split('T')[0] 
        : "",
      priority: initialTask?.priority || "medium",
    },
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task created",
        description: "Your task has been added successfully.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (data: TaskFormValues & { id: number }) => {
      const { id, ...taskData } = data;
      const res = await apiRequest("PUT", `/api/tasks/${id}`, taskData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: TaskFormValues) => {
    if (initialTask) {
      updateTaskMutation.mutate({ ...data, id: initialTask.id });
    } else {
      createTaskMutation.mutate(data);
    }
  };
  
  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter task description" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialTask ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialTask ? "Update Task" : "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
