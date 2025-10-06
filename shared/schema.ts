import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const commits = pgTable("commits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  commitMessage: text("commit_message").notNull(),
  branch: text("branch").notNull(),
  filesChanged: text("files_changed").array().notNull(),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  commitSha: text("commit_sha"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommitSchema = createInsertSchema(commits).omit({
  id: true,
  createdAt: true,
});

export type InsertCommit = z.infer<typeof insertCommitSchema>;
export type Commit = typeof commits.$inferSelect;

export const changesetSchema = z.object({
  repo: z.string(),
  branch: z.string(),
  base: z.string().optional(),
  commit_message: z.string(),
  files: z.record(z.string()),
  sig: z.string().optional(),
});

export type Changeset = z.infer<typeof changesetSchema>;
