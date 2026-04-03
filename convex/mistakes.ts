import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./rls";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("mistakes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    unit: v.string(),
    topic: v.string(),
    question: v.string(),
    yourAnswer: v.string(),
    correctAnswer: v.string(),
    timestamp: v.float64(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await ctx.db.insert("mistakes", { ...args, userId });
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const all = await ctx.db
      .query("mistakes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(500);
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
  },
});
