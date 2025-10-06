import { type User, type InsertUser, type Commit, type InsertCommit } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCommits(limit?: number): Promise<Commit[]>;
  createCommit(commit: InsertCommit): Promise<Commit>;
  updateCommit(id: string, updates: Partial<InsertCommit>): Promise<Commit | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private commits: Map<string, Commit>;

  constructor() {
    this.users = new Map();
    this.commits = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCommits(limit: number = 50): Promise<Commit[]> {
    const commits = Array.from(this.commits.values());
    commits.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return commits.slice(0, limit);
  }

  async createCommit(insertCommit: InsertCommit): Promise<Commit> {
    const id = randomUUID();
    const commit: Commit = {
      id,
      commitMessage: insertCommit.commitMessage,
      branch: insertCommit.branch,
      filesChanged: insertCommit.filesChanged,
      status: insertCommit.status,
      errorMessage: insertCommit.errorMessage ?? null,
      commitSha: insertCommit.commitSha ?? null,
      createdAt: new Date(),
    };
    this.commits.set(id, commit);
    return commit;
  }

  async updateCommit(id: string, updates: Partial<InsertCommit>): Promise<Commit | undefined> {
    const commit = this.commits.get(id);
    if (!commit) {
      return undefined;
    }
    const updatedCommit = { ...commit, ...updates };
    this.commits.set(id, updatedCommit);
    return updatedCommit;
  }
}

export const storage = new MemStorage();
