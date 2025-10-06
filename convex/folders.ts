import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const folders = await ctx.db.query("folders").collect();
    return folders;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const folderId = await ctx.db.insert("folders", {
      name: args.name,
      createdTime: Date.now(),
    });

    return folderId;
  },
});

export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    // Delete folder
    await ctx.db.delete(args.folderId);

    // Update all notes in this folder to have no folder
    const notesInFolder = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("folderId"), args.folderId))
      .collect();

    for (const note of notesInFolder) {
      await ctx.db.patch(note._id, { folderId: undefined });
    }
  },
});

export const renameFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.folderId, {
      name: args.name,
    });
  },
});
