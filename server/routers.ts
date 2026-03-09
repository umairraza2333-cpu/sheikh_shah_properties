import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createInquiry,
  getInquiries,
  updateInquiry,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Properties procedures
  properties: router({
    list: publicProcedure
      .input(z.object({
        area: z.string().optional(),
        bedrooms: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getProperties(input);
      }),

    featured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }).optional())
      .query(async ({ input }) => {
        return await getFeaturedProperties(input?.limit);
      }),

    byId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getPropertyById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        price: z.string(),
        location: z.string(),
        area: z.string(),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        propertyType: z.enum(["apartment", "house", "commercial", "plot", "office"]),
        imageUrl: z.string().optional(),
        images: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Only admins can create properties
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await createProperty({
          ...input,
          price: input.price as any,
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          location: z.string().optional(),
          area: z.string().optional(),
          bedrooms: z.number().optional(),
          bathrooms: z.number().optional(),
          propertyType: z.enum(["apartment", "house", "commercial", "plot", "office"]).optional(),
          imageUrl: z.string().optional(),
          images: z.array(z.string()).optional(),
          featured: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await updateProperty(input.id, input.data as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await deleteProperty(input);
        return { success: true };
      }),
  }),

  // Projects procedures
  projects: router({
    list: publicProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getProjects(input?.status);
      }),

    byId: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getProjectById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        location: z.string(),
        status: z.enum(["ongoing", "completed", "planning"]),
        imageUrl: z.string().optional(),
        images: z.array(z.string()).optional(),
        totalUnits: z.number().optional(),
        completedUnits: z.number().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await createProject(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          status: z.enum(["ongoing", "completed", "planning"]).optional(),
          imageUrl: z.string().optional(),
          images: z.array(z.string()).optional(),
          totalUnits: z.number().optional(),
          completedUnits: z.number().optional(),
          featured: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await updateProject(input.id, input.data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await deleteProject(input);
        return { success: true };
      }),
  }),

  // Inquiries procedures
  inquiries: router({
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string(),
        message: z.string().optional(),
        propertyId: z.number().optional(),
        projectId: z.number().optional(),
        inquiryType: z.enum(["property_inquiry", "project_inquiry", "general_inquiry"]),
      }))
      .mutation(async ({ input }) => {
        await createInquiry({
          ...input,
          status: 'new',
        });
        return { success: true };
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await getInquiries();
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "interested", "closed"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await updateInquiry(input.id, { status: input.status });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
