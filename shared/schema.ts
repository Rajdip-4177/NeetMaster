import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  age: integer("age"),
  address: text("address"),
  class: text("class"), // "11", "12", "13-dropper"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phoneNumber: true,
  fullName: true,
  dateOfBirth: true,
  age: true,
  address: true,
  class: true,
});

// Task table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  dueDate: date("due_date"),
  priority: text("priority").notNull(), // "high", "medium", "low"
  subject: text("subject"), // "biology", "physics", "chemistry", "general"
  description: text("description"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  dueDate: true,
  priority: true,
  subject: true,
  description: true,
  completed: true,
});

// Quiz attempt table
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(), // "biology", "physics", "chemistry"
  chapter: text("chapter").notNull(),
  testId: text("test_id").notNull(),
  score: integer("score"),
  correctAnswers: integer("correct_answers"),
  wrongAnswers: integer("wrong_answers"),
  unattempted: integer("unattempted"),
  timeTaken: integer("time_taken"), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).pick({
  userId: true,
  subject: true,
  chapter: true,
  testId: true,
  score: true,
  correctAnswers: true,
  wrongAnswers: true,
  unattempted: true,
  timeTaken: true,
});

// Bookmarked questions table
export const bookmarkedQuestions = pgTable("bookmarked_questions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(),
  chapter: text("chapter").notNull(),
  testId: text("test_id").notNull(),
  questionId: text("question_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarkedQuestions).pick({
  userId: true,
  subject: true,
  chapter: true,
  testId: true,
  questionId: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export type BookmarkedQuestion = typeof bookmarkedQuestions.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
