import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTaskSchema, insertBookmarkSchema, insertQuizAttemptSchema, insertQuestionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is an admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated() && (req.user as Express.User).isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // User profile routes
  app.get("/api/profile", isAuthenticated, (req, res) => {
    // User is already available in req.user
    // Remove sensitive information like password
    const { password, ...userWithoutPassword } = req.user as Express.User;
    res.json(userWithoutPassword);
  });

  app.put("/api/profile", isAuthenticated, async (req, res, next) => {
    try {
      const userId = (req.user as Express.User).id;
      
      // Calculate age if dateOfBirth is provided
      if (req.body.dateOfBirth) {
        const dob = new Date(req.body.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        req.body.age = age;
      }
      
      // Don't allow updating username or password through this endpoint
      const { username, password, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // Task routes
  app.get("/api/tasks", isAuthenticated, async (req, res) => {
    const userId = (req.user as Express.User).id;
    const tasks = await storage.getTasks(userId);
    res.json(tasks);
  });

  app.post("/api/tasks", isAuthenticated, async (req, res, next) => {
    try {
      const userId = (req.user as Express.User).id;
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({ ...taskData, userId });
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.put("/api/tasks/:id", isAuthenticated, async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      const userId = (req.user as Express.User).id;
      
      const existingTask = await storage.getTask(taskId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (existingTask.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this task" });
      }
      
      const updatedTask = await storage.updateTask(taskId, req.body);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", isAuthenticated, async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      const userId = (req.user as Express.User).id;
      
      const existingTask = await storage.getTask(taskId);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (existingTask.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this task" });
      }
      
      const success = await storage.deleteTask(taskId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete task" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Bookmark routes
  app.get("/api/bookmarks", isAuthenticated, async (req, res) => {
    const userId = (req.user as Express.User).id;
    const bookmarks = await storage.getBookmarks(userId);
    res.json(bookmarks);
  });

  app.post("/api/bookmarks", isAuthenticated, async (req, res, next) => {
    try {
      const userId = (req.user as Express.User).id;
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark({ ...bookmarkData, userId });
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.delete("/api/bookmarks/:id", isAuthenticated, async (req, res, next) => {
    try {
      const bookmarkId = parseInt(req.params.id);
      const userId = (req.user as Express.User).id;
      
      const existingBookmark = await storage.getBookmark(bookmarkId);
      if (!existingBookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      if (existingBookmark.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this bookmark" });
      }
      
      const success = await storage.deleteBookmark(bookmarkId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete bookmark" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Quiz attempt routes
  app.get("/api/quiz-attempts", isAuthenticated, async (req, res) => {
    const userId = (req.user as Express.User).id;
    const attempts = await storage.getQuizAttempts(userId);
    res.json(attempts);
  });

  app.post("/api/quiz-attempts", isAuthenticated, async (req, res, next) => {
    try {
      const userId = (req.user as Express.User).id;
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt({ ...attemptData, userId });
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't allow admins to delete themselves
      if (userId === (req.user as Express.User).id) {
        return res.status(400).json({ message: "Cannot delete your own admin account" });
      }
      
      const success = await storage.deleteUser(userId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete user" });
      }
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/users/:id/toggle-admin", isAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't allow admins to remove their own admin status
      if (userId === (req.user as Express.User).id) {
        return res.status(400).json({ message: "Cannot remove your own admin status" });
      }
      
      const updatedUser = await storage.updateUser(userId, { isAdmin: !user.isAdmin });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // Dashboard analytics for admin
  app.get("/api/admin/analytics", isAdmin, async (req, res, next) => {
    try {
      const [userCount, quizAttempts, taskCount] = await Promise.all([
        storage.getUserCount(),
        storage.getAllQuizAttempts(),
        storage.getTaskCount()
      ]);
      
      res.json({
        userCount,
        quizAttemptCount: quizAttempts.length,
        taskCount,
        recentQuizAttempts: quizAttempts.slice(-10), // Last 10 attempts
      });
    } catch (error) {
      next(error);
    }
  });

  // Admin question management routes
  app.get("/api/admin/questions", isAdmin, async (req, res, next) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/questions/:id", isAdmin, async (req, res, next) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getQuestionById(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/questions", isAdmin, async (req, res, next) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      next(error);
    }
  });

  app.put("/api/admin/questions/:id", isAdmin, async (req, res, next) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getQuestionById(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const updatedQuestion = await storage.updateQuestion(questionId, req.body);
      res.json(updatedQuestion);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/questions/:id", isAdmin, async (req, res, next) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getQuestionById(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const success = await storage.deleteQuestion(questionId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete question" });
      }
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
