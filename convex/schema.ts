import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  progress: defineTable({
    userId: v.id("users"),
    unitSlug: v.string(),
    completedTopics: v.array(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_unitSlug", ["userId", "unitSlug"]),

  mistakes: defineTable({
    userId: v.id("users"),
    unit: v.string(),
    topic: v.string(),
    question: v.string(),
    yourAnswer: v.string(),
    correctAnswer: v.string(),
    timestamp: v.float64(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_unit", ["userId", "unit"]),
});
