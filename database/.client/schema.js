import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// Contact table
export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  first: text("first").notNull(),
  last: text("last").notNull(),
  avatar: text("avatar").notNull(),
  twitter: text("twitter").notNull(),
  notes: text("notes").notNull(),
  favorite: boolean("favorite").default(false),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Branches table (linked to organizations)
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id").references(() => organizations.id), // Fixed reference
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Companies table (linked to organizations and self-referencing for child companies)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id").references(() => organizations.id), // Fixed reference
  parent_company_id: integer("parent_company_id").references(() => companies.id), // Fixed self-reference, made nullable
  name: varchar("name").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Roles table
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Users table (linked to organizations, branches, companies, and roles)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id").references(() => organizations.id), // Fixed reference
  branch_id: integer("branch_id").references(() => branches.id), // Fixed reference
  company_id: integer("company_id").references(() => companies.id), // Fixed reference
  role_id: integer("role_id").references(() => roles.id), // Fixed reference
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Projects table (linked to organizations, branches, and companies)
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  organization_id: integer("organization_id").references(() => organizations.id), // Fixed reference
  branch_id: integer("branch_id").references(() => branches.id), // Fixed reference
  company_id: integer("company_id").references(() => companies.id), // Fixed reference
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Assignments table (links users to projects)
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id), // Fixed reference
  project_id: integer("project_id").references(() => projects.id), // Fixed reference
  start_date: timestamp("start_date", { withTimezone: true }).notNull(),
  end_date: timestamp("end_date", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});