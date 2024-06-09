import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfilePicture = query({
    args:{
        userId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("profilePicture")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .collect();
    }
})

export const changeProfilePicture = mutation({
    args:{
        id: v.id("profilePicture"),
        newPictureFile: v.string()
    },
    handler: async (ctx, args) => {
        const { id, newPictureFile } = args;
        return await ctx.db.patch(id, {picture:newPictureFile})
    }
});