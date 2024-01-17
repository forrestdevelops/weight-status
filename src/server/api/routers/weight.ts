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

    create: protectedProcedure
        .input(z.object({ weight: z.number().min(100).max(500) }))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
          //  await new Promise((resolve) => setTimeout(resolve, 1000));

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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