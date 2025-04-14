import { 
  User, InsertUser, Task, InsertTask, 
  Bookmark, InsertBookmark, QuizAttempt, InsertQuizAttempt 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Task methods
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask & { userId: number }): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Bookmark methods
  getBookmarks(userId: number): Promise<Bookmark[]>;
  getBookmark(id: number): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark & { userId: number }): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  
  // Quiz attempt methods
  getQuizAttempts(userId: number): Promise<QuizAttempt[]>;
  getQuizAttempt(id: number): Promise<QuizAttempt | undefined>;
  createQuizAttempt(attempt: InsertQuizAttempt & { userId: number }): Promise<QuizAttempt>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private bookmarks: Map<number, Bookmark>;
  private quizAttempts: Map<number, QuizAttempt>;
  private userIdCounter: number;
  private taskIdCounter: number;
  private bookmarkIdCounter: number;
  private quizAttemptIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.bookmarks = new Map();
    this.quizAttempts = new Map();
    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    this.bookmarkIdCounter = 1;
    this.quizAttemptIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask & { userId: number }): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const task: Task = { ...taskData, id, createdAt: now };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask = { ...existingTask, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Bookmark methods
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async getBookmark(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(bookmarkData: InsertBookmark & { userId: number }): Promise<Bookmark> {
    const id = this.bookmarkIdCounter++;
    const now = new Date();
    const bookmark: Bookmark = { ...bookmarkData, id, createdAt: now };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Quiz attempt methods
  async getQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      (attempt) => attempt.userId === userId
    );
  }

  async getQuizAttempt(id: number): Promise<QuizAttempt | undefined> {
    return this.quizAttempts.get(id);
  }

  async createQuizAttempt(attemptData: InsertQuizAttempt & { userId: number }): Promise<QuizAttempt> {
    const id = this.quizAttemptIdCounter++;
    const now = new Date();
    const attempt: QuizAttempt = { ...attemptData, id, createdAt: now };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }
}

export const storage = new MemStorage();
