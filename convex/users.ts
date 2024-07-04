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

export const assignUserElection = mutation({
  args:{
    id: v.id('users'),
    assignedElection: v.array<string>(
      v.string()
    )
  },
  handler: async (ctx, args) => {
    const {id, assignedElection} = args;
    const beforeChange = await ctx.db.get(id);
    const afterChange = beforeChange?.assignedElections ? 
      beforeChange?.assignedElections?.concat(assignedElection):
      assignedElection
    ;
    if(afterChange){
      return await ctx.db.patch(id, {
        assignedElections: afterChange
      });
    }
    return;
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
    return userData;
  },
});
export const setIpAndRecentLogin = mutation({
  args:{
    id: v.id("users"),
    ip: v.string()
  },
  handler: async (ctx, args) => {
    return ctx.db.patch(args.id, {ip: args.ip, pastLogin: Date.now()});
  }
});
//  PATCH (UPDATE) METHOD
export const changeUser = mutation({
  args: { 
    id: v.id("users"),
    selectedField: v.object({
      ip:v.optional(v.string()),
      pastLogin:v.optional(v.number()),
      username:v.optional(v.string()),
      password:v.optional(v.string()),
      lastName:v.optional(v.string()),
      firstName:v.optional(v.string()),
      email:v.optional(v.string()),
    })
   },
  handler: async (ctx, args) => {
    const { id, selectedField } = args;
    const beforeChange = await ctx.db.get(id);
    return await ctx.db.patch(id, 
      {
        password: beforeChange?.password !== selectedField.password ? selectedField.password : beforeChange?.password,
        email: beforeChange?.email !== selectedField.email ? selectedField.email : beforeChange?.email,
        username: beforeChange?.username !== selectedField.username ? selectedField.username : beforeChange?.username,
        firstName: beforeChange?.firstName !== selectedField.firstName ? selectedField.firstName : beforeChange?.firstName,
        lastName: beforeChange?.lastName !== selectedField.lastName ? selectedField.lastName : beforeChange?.lastName,
        ip: beforeChange?.ip !== selectedField.ip ? selectedField.ip : beforeChange?.ip,
        pastLogin: beforeChange?.pastLogin !== selectedField.pastLogin ? selectedField.pastLogin : beforeChange?.pastLogin,
      }
    );
  },
});

export const deleteUser = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
    },
  });