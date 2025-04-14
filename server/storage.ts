import { 
  users, type User, type InsertUser, 
  tasks, type Task, type InsertTask,
  quizAttempts, type QuizAttempt, type InsertQuizAttempt,
  bookmarkedQuestions, type BookmarkedQuestion, type InsertBookmark
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Quiz operations
  getQuizAttempts(userId: number): Promise<QuizAttempt[]>;
  saveQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  
  // Bookmark operations
  getBookmarks(userId: number): Promise<BookmarkedQuestion[]>;
  createBookmark(bookmark: InsertBookmark): Promise<BookmarkedQuestion>;
  deleteBookmark(userId: number, questionId: string): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private quizAttempts: Map<number, QuizAttempt>;
  private bookmarks: Map<number, BookmarkedQuestion>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentTaskId: number;
  currentQuizAttemptId: number;
  currentBookmarkId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.quizAttempts = new Map();
    this.bookmarks = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentQuizAttemptId = 1;
    this.currentBookmarkId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const createdAt = new Date();
    const task: Task = { ...insertTask, id, createdAt };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = await this.getTaskById(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Quiz methods
  async getQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      attempt => attempt.userId === userId
    );
  }

  async saveQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const completedAt = new Date();
    const attempt: QuizAttempt = { ...insertAttempt, id, completedAt };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }

  // Bookmark methods
  async getBookmarks(userId: number): Promise<BookmarkedQuestion[]> {
    return Array.from(this.bookmarks.values()).filter(
      bookmark => bookmark.userId === userId
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<BookmarkedQuestion> {
    const id = this.currentBookmarkId++;
    const createdAt = new Date();
    const bookmark: BookmarkedQuestion = { ...insertBookmark, id, createdAt };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(userId: number, questionId: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      b => b.userId === userId && b.questionId === questionId
    );
    
    if (!bookmark) return false;
    return this.bookmarks.delete(bookmark.id);
  }
}

// Export storage instance
export const storage = new MemStorage();
