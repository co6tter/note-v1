import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const notesJson = await ctx.db.query("notes").collect();
    return notesJson;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      lastEditTime: Date.now(),
      isFavorite: false,
      tags: [],
    });

    return noteId;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      title: args.title,
      content: args.content,
      lastEditTime: Date.now(),
    });
  },
});

export const toggleFavorite = mutation({
  args: {
    noteId: v.id("notes"),
    isFavorite: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      isFavorite: args.isFavorite,
    });
  },
});

export const updateTags = mutation({
  args: {
    noteId: v.id("notes"),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      tags: args.tags,
    });
  },
});

export const duplicateNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    const originalNote = await ctx.db.get(args.noteId);
    if (!originalNote) {
      throw new Error("Note not found");
    }

    const newNoteId = await ctx.db.insert("notes", {
      title: `${originalNote.title} (コピー)`,
      content: originalNote.content,
      lastEditTime: Date.now(),
      isFavorite: false,
      tags: originalNote.tags || [],
    });

    return newNoteId;
  },
});
