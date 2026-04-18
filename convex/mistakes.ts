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
    // Dedupe on (unit, question) — if the user already has this mistake
    // recorded, update it in place so the list reflects the latest attempt
    // instead of growing duplicates.
    const existing = await ctx.db
      .query("mistakes")
      .withIndex("by_userId_and_unit", (q) =>
        q.eq("userId", userId).eq("unit", args.unit),
      )
      .collect();
    const match = existing.find((m) => m.question === args.question);
    if (match) {
      await ctx.db.patch(match._id, {
        topic: args.topic,
        yourAnswer: args.yourAnswer,
        correctAnswer: args.correctAnswer,
        timestamp: args.timestamp,
      });
      return;
    }
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
