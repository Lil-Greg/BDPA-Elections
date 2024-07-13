import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Add User ID later using the id of the object
export default defineSchema({
    users: defineTable({
        assignedElections: v.optional(v.array<string>(
            v.string()
        )),
        participatedElections: v.optional(v.array<string>(v.string())),
        pastLogin: v.optional(v.number()),
        ip: v.optional(v.string()),
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
    profilePicture:defineTable({
        userId: v.string(),
        picture: v.string()
    })
});