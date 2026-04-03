import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./rls";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    return await ctx.db
      .query("progress")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const toggleComplete = mutation({
  args: {
    unitSlug: v.string(),
    topicId: v.string(),
  },
  handler: async (ctx, { unitSlug, topicId }) => {
    const userId = await requireAuth(ctx);

    const existing = await ctx.db
      .query("progress")
      .withIndex("by_userId_and_unitSlug", (q) =>
        q.eq("userId", userId).eq("unitSlug", unitSlug)
      )
      .unique();

    if (existing) {
      const topics = new Set(existing.completedTopics);
      if (topics.has(topicId)) {
        topics.delete(topicId);
      } else {
        topics.add(topicId);
      }
      await ctx.db.patch(existing._id, {
        completedTopics: Array.from(topics),
      });
    } else {
      await ctx.db.insert("progress", {
        userId,
        unitSlug,
        completedTopics: [topicId],
      });
    }
  },
});
