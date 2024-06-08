import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getSingleUser = query({
  args:{
    username:v.string()
  },
  handler: async(ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .collect()
    return user
  }
});

export const createUser = mutation(
    {
  args: {
    password: v.string(),
    type: v.string(),
    salt: v.string(),
    key: v.string(),
    username: v.string(),
    email: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    address: v.string(),
    firstName:v.string(),
    lastName:v.string()
    },
  handler: async (ctx, args) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userData = await ctx.db.insert("users", { password: args.password, type: args.type, salt: args.salt, key: args.key, email: args.email, username: args.username, city: args.city, state: args.state, address: args.address, zip:args.zip, firstName: args.firstName, lastName: args.lastName });
    // do something with `taskId`
  },
});
//  PATCH (UPDATE) METHOD
// export const updateTask = mutation({
//   args: { id: v.id("users") },
//   handler: async (ctx, args) => {
//     const { id } = args;
//     console.log(await ctx.db.get(id));
//     // { text: "foo", status: { done: true }, _id: ... }

//     // Add `tag` and overwrite `status`:
//     await ctx.db.patch(id, { tag: "bar", status: { archived: true } });
//     console.log(await ctx.db.get(id));
//     // { text: "foo", tag: "bar", status: { archived: true }, _id: ... }

//     // Unset `tag` by setting it to `undefined`
//     await ctx.db.patch(id, { tag: undefined });
//     console.log(await ctx.db.get(id));
//     // { text: "foo", status: { archived: true }, _id: ... }
//   },
// });

export const deleteTask = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });