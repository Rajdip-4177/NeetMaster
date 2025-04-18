import { 
  User, InsertUser, Task, InsertTask, 
  Bookmark, InsertBookmark, QuizAttempt, InsertQuizAttempt 
} from "@shared/schema";
import session from "express-session";
import { DatabaseStorage } from "./db-storage";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Admin methods
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUserCount(): Promise<number>;
  getAllQuizAttempts(): Promise<QuizAttempt[]>;
  getTaskCount(): Promise<number>;

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
  sessionStore: session.Store;
}

// Using DatabaseStorage implementation
export const storage = new DatabaseStorage();
