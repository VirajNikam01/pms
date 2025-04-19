import { sql, SQL } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";



export const contact = pgTable(
  "contact",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    first: text("first"),
    last: text("last"),
    avatar: text("avatar"),
    twitter: text("twitter"),
    notes: text("notes"),
    favorite: boolean("favorite"),

  }
);