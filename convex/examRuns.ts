import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./rls";

export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const limit = Math.max(1, Math.min(Math.floor(args.limit ?? 10), 30));

    return await ctx.db
      .query("examRuns")
      .withIndex("by_userId_and_completedAt", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const record = mutation({
  args: {
    modeKind: v.string(),
    durationSec: v.number(),
    questionCount: v.number(),
    correctCount: v.number(),
    accuracy: v.number(),
    unitAccuracy: v.record(v.string(), v.number()),
    topicMisses: v.record(v.string(), v.number()),
    startedAt: v.number(),
    completedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const id = await ctx.db.insert("examRuns", {
      userId,
      ...args,
    });

    return await ctx.db.get(id);
  },
});
