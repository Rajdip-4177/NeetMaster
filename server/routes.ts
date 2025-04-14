import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertQuizAttemptSchema, insertBookmarkSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const taskData = { ...req.body, userId: req.user.id };
      const validatedData = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const taskId = parseInt(req.params.id);
    const task = await storage.getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    try {
      const updatedTask = await storage.updateTask(taskId, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const taskId = parseInt(req.params.id);
    const task = await storage.getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const deleted = await storage.deleteTask(taskId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Quiz attempts routes
  app.get("/api/quiz-attempts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const attempts = await storage.getQuizAttempts(req.user.id);
    res.json(attempts);
  });

  app.post("/api/quiz-attempts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const attemptData = { ...req.body, userId: req.user.id };
      const validatedData = insertQuizAttemptSchema.parse(attemptData);
      const attempt = await storage.saveQuizAttempt(validatedData);
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to save quiz attempt" });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const bookmarks = await storage.getBookmarks(req.user.id);
    res.json(bookmarks);
  });

  app.post("/api/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const bookmarkData = { ...req.body, userId: req.user.id };
      const validatedData = insertBookmarkSchema.parse(bookmarkData);
      
      const bookmark = await storage.createBookmark(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:questionId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const questionId = req.params.questionId;
    const deleted = await storage.deleteBookmark(req.user.id, questionId);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Bookmark not found" });
    }
  });

  // User profile route
  app.put("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      // Don't allow updating username or password through this route
      const { username, password, ...allowedUpdates } = req.body;
      
      const updatedUser = await storage.updateUser(req.user.id, allowedUpdates);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
