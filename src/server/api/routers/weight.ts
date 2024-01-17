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


    getProtectedMessage: protectedProcedure.query(() => {
        return "This message is protected!!";
    }),
});