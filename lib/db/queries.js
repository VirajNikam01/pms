// lib/db/queries.js
"use client";

import { getDb } from "./index";
import { usersTable } from "../schema";
import { eq } from "drizzle-orm";

export async function viewUsers() {
  const db = getDb();
  try {
    const users = await db.select().from(usersTable);
    console.table(users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function addUser(user) {
  const db = getDb();
  try {
    await db.insert(usersTable).values(user);
    console.log(`User ${user.name} added!`);
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}
