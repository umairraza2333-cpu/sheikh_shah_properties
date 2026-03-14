import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["buyer", "agent", "admin"]).default("buyer").notNull(),
  userType: mysqlEnum("userType", ["buyer", "agent"]).default("buyer"),
  // Trial system for agents
  trialStartDate: timestamp("trialStartDate"),
  trialEndDate: timestamp("trialEndDate"),
  isTrialActive: boolean("isTrialActive").default(false),
  isPremium: boolean("isPremium").default(false),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "inactive", "expired", "cancelled"]).default("inactive"),
  // Agent profile information
  companyName: varchar("companyName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  profileImage: varchar("profileImage", { length: 500 }),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Agent Listings Table - tracks properties posted by agents
export const agentListings = mysqlTable("agentListings", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  propertyId: int("propertyId").notNull(),
  isActive: boolean("isActive").default(true),
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentListing = typeof agentListings.$inferSelect;
export type InsertAgentListing = typeof agentListings.$inferInsert;

// Favorites Table - for buyers to save properties
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  propertyId: int("propertyId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

// Properties Table
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  area: varchar("area", { length: 100 }).notNull(), // e.g., "Scheme 33", "Gulshan-e-Iqbal"
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  propertyType: mysqlEnum("propertyType", ["apartment", "house", "commercial", "plot", "office"]).notNull(),
  status: mysqlEnum("status", ["available", "sold", "rented"]).default("available").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  images: json("images").$type<string[]>(), // Array of image URLs
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Projects Table
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ongoing", "completed", "planning"]).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  images: json("images").$type<string[]>(),
  startDate: timestamp("startDate"),
  completionDate: timestamp("completionDate"),
  totalUnits: int("totalUnits"),
  completedUnits: int("completedUnits"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Inquiries Table
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message"),
  propertyId: int("propertyId"),
  projectId: int("projectId"),
  inquiryType: mysqlEnum("inquiryType", ["property_inquiry", "project_inquiry", "general_inquiry"]).notNull(),
  status: mysqlEnum("status", ["new", "contacted", "interested", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

// Subscription Payments Table - for tracking agent payments
export const subscriptionPayments = mysqlTable("subscriptionPayments", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("PKR"),
  paymentMethod: mysqlEnum("paymentMethod", ["jazzcash", "easypaisa", "bank_transfer", "credit_card"]).notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  subscriptionPeriodStart: timestamp("subscriptionPeriodStart"),
  subscriptionPeriodEnd: timestamp("subscriptionPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPayment = typeof subscriptionPayments.$inferSelect;
export type InsertSubscriptionPayment = typeof subscriptionPayments.$inferInsert;
