import { 
  User, InsertUser, Task, InsertTask, 
  Bookmark, InsertBookmark, QuizAttempt, InsertQuizAttempt,
  users, tasks, bookmarks, quizAttempts
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as connectPgModule from "connect-pg-simple";
import { pool } from "./db";
import { IStorage } from "./storage";

// Create the session store
const connectPg = connectPgModule.default;
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });

    // Run migrations
    this.initDb();
  }

  // Initialize database and run migrations
  private async initDb() {
    try {
      // Check if isAdmin column exists
      const client = await pool.connect();
      try {
        const result = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'is_admin'
        `);
        
        // If isAdmin column doesn't exist, add it
        if (result.rowCount === 0) {
          console.log("Adding isAdmin column to users table");
          await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false
          `);
        }
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error running migrations:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Task methods
  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(taskData: InsertTask & { userId: number }): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    await db.delete(tasks).where(eq(tasks.id, id));
    return true; // Assuming success if no error thrown
  }

  // Bookmark methods
  async getBookmarks(userId: number): Promise<Bookmark[]> {
    return db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
  }

  async getBookmark(id: number): Promise<Bookmark | undefined> {
    const [bookmark] = await db.select().from(bookmarks).where(eq(bookmarks.id, id));
    return bookmark;
  }

  async createBookmark(bookmarkData: InsertBookmark & { userId: number }): Promise<Bookmark> {
    const [bookmark] = await db.insert(bookmarks).values(bookmarkData).returning();
    return bookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    await db.delete(bookmarks).where(eq(bookmarks.id, id));
    return true; // Assuming success if no error thrown
  }

  // Quiz attempt methods
  async getQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));
  }

  async getQuizAttempt(id: number): Promise<QuizAttempt | undefined> {
    const [attempt] = await db.select().from(quizAttempts).where(eq(quizAttempts.id, id));
    return attempt;
  }

  async createQuizAttempt(attemptData: InsertQuizAttempt & { userId: number }): Promise<QuizAttempt> {
    const [attempt] = await db.insert(quizAttempts).values(attemptData).returning();
    return attempt;
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getUserCount(): Promise<number> {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT COUNT(*) as count FROM users');
        return parseInt(result.rows[0]?.count || '0', 10);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error getting user count:", error);
      return 0;
    }
  }

  async getAllQuizAttempts(): Promise<QuizAttempt[]> {
    return db.select().from(quizAttempts).orderBy(quizAttempts.createdAt);
  }

  async getTaskCount(): Promise<number> {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT COUNT(*) as count FROM tasks');
        return parseInt(result.rows[0]?.count || '0', 10);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error getting task count:", error);
      return 0;
    }
  }

  // Question management methods
  async getAllQuestions() {
    try {
      const result = await db.query.questions.findMany();
      return result;
    } catch (error) {
      console.error("Error getting all questions:", error);
      throw error;
    }
  }

  async getQuestionById(id: number) {
    try {
      const result = await db.query.questions.findFirst({
        where: eq(schema.questions.id, id)
      });
      return result;
    } catch (error) {
      console.error(`Error getting question with id ${id}:`, error);
      throw error;
    }
  }

  async createQuestion(questionData: Omit<typeof schema.questions.$inferInsert, "id">) {
    try {
      // Ensure timestamps are Date objects
      const now = new Date();
      const dataWithTimestamps = {
        ...questionData,
        createdAt: now,
        updatedAt: now
      };
      const result = await db.insert(schema.questions).values(dataWithTimestamps).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  }

  async updateQuestion(id: number, questionData: Partial<Omit<typeof schema.questions.$inferInsert, "id">>) {
    try {
      // Ensure updatedAt is a Date object
      const dataWithTimestamp = {
        ...questionData,
        updatedAt: new Date()
      };
      const result = await db
        .update(schema.questions)
        .set(dataWithTimestamp)
        .where(eq(schema.questions.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error(`Error updating question with id ${id}:`, error);
      throw error;
    }
  }

  async deleteQuestion(id: number) {
    try {
      await db.delete(schema.questions).where(eq(schema.questions.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting question with id ${id}:`, error);
      return false;
    }
  }
}