import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure, } from "~/server/api/trpc";

export const weightRouter = createTRPCRouter({
    userInfo: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
        return {
            greeting: `Hello ${input.text}`,
        };
    }),

    getWeights: protectedProcedure
        .input(z.object({}))
        .query(async ({ ctx }) => {
            return ctx.db.weight.findMany({
                where: { createdBy: { id: ctx.session.user.id } },
                orderBy: { createdAt: "desc" },
            });
        }),

    create: protectedProcedure
        .input(z.object({ weight: z.number().min(100).max(500) }))
        .mutation(async ({ ctx, input }) => {


            return ctx.db.weight.create({
                data: {
                    weight: input.weight,
                    createdBy: { connect: { id: ctx.session.user.id } },
                },
            });
        }),



    getProtectedMessage: protectedProcedure.query(() => {
        return "Welcome, ";
    }),
});