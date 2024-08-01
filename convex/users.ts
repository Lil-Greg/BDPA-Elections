import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// api.users.functionName
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUsernames = query({
  args:{},
  handler:async(ctx) => {
    const query = await ctx.db.query("users").collect();
    return query.map(user => user.username);
  }
});

export const auth = query({
  args: {
    username: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users")
      .filter(data => data.eq(data.field("username"), args.username) && data.eq(data.field("password"), args.password))
      .collect();
  },
});

export const emailAuth = query({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("users")
      .filter(data => data.eq(data.field("email"), args.email))
      .collect();
  },
});

export const changePassword = mutation({
  args: {
    id: v.id("users"),
    password: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { password: args.password });
  },
})

export const getSingleUser = query({
  args: {
    username: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .collect()
    return user
  }
});

export const assignUserElection = mutation({
  args: {
    id: v.id('users'),
    assignedElection: v.array<string>(
      v.string()
    )
  },
  handler: async (ctx, args) => {
    const { id, assignedElection } = args;
    const beforeChange = await ctx.db.get(id);
    const afterChange = beforeChange?.assignedElections ?
      beforeChange?.assignedElections?.concat(assignedElection) :
      assignedElection;
    return await ctx.db.patch(id, {
      assignedElections: afterChange
    });
  }
});

export const setParticipatedElection = mutation({
  args: {
    id: v.id("users"),
    electionId: v.string(),
  },
  handler: async (ctx, args) => {
    const beforeChange = await ctx.db.get(args.id);
    const afterChange = beforeChange?.participatedElections?.filter(pElections => args.electionId === pElections);
    if (afterChange !== undefined && afterChange.length == 1) {
      const concat = beforeChange?.participatedElections?.concat(...afterChange);
      return await ctx.db.patch(args.id, { participatedElections: concat });
    } else {
      const electionId = [args.electionId];
      return await ctx.db.patch(args.id, { participatedElections: electionId });
    }

  },
})

export const changeType = mutation({
  args: {
    id: v.id("users"),
    type: v.string(),
  },
  handler: (ctx, args) => {
    return ctx.db.patch(args.id, { type: args.type });
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
      firstName: v.string(),
      lastName: v.string()
    },
    handler: async (ctx, args) => {
      const userData = await ctx.db.insert("users", { password: args.password, type: args.type, salt: args.salt, key: args.key, email: args.email, username: args.username, city: args.city, state: args.state, address: args.address, zip: args.zip, firstName: args.firstName, lastName: args.lastName });
      return userData;
    },
  });

export const setIpAndRecentLogin = mutation({
  args: {
    id: v.id("users"),
    ip: v.string()
  },
  handler: async (ctx, args) => {
    const beforeChange = await ctx.db.get(args.id);

    if (!beforeChange) {
      console.warn("Cannot Set Ip, get is undefined");
      return;
    }
    beforeChange.ip?.push(args.ip);
    beforeChange.pastLogin?.push(Date.now());
    // Use Slice to remove the last
    return await ctx.db.patch(args.id, {
      ip: beforeChange.ip ? beforeChange.ip?.slice(-5, beforeChange.ip.length) : [args.ip],
      pastLogin: beforeChange.pastLogin ? beforeChange.pastLogin.slice(-5, beforeChange.pastLogin.length) : [Date.now()]
    });
  }
});
//  PATCH (UPDATE) METHOD
export const changeUserInProfile = mutation({
  args: {
    id: v.id("users"),
    selectedField: v.object({
      username: v.optional(v.string()),
      password: v.optional(v.string()),
      lastName: v.optional(v.string()),
      firstName: v.optional(v.string()),
      email: v.optional(v.string()),
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