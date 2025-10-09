import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    lastEditTime: v.number(),
    isFavorite: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
  }),
  folders: defineTable({
    name: v.string(),
    createdTime: v.number(),
  }),
});
