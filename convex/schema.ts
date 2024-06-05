import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Add User ID later using the id of the object
export default defineSchema({
    users: defineTable({
        password: v.string(),
        salt: v.string(),
        key:v.string(),
        username: v.string(),
        email: v.string(),
        type: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        address:v.string(),
        firstName:v.string(),
        lastName:v.string()
    }),
});