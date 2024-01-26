import {GetStaticProps, NextPage} from "next";
import Head from "next/head";
import Navigation from "~/components/Navigation";
const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {


    return (
        <>
            <Head>
                <title>Weight Tracker</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="min-h-screen  items-start justify-center bg-gradient-to-b from-[#12162C] to-[#15162c]">
                <Navigation />
                <p className="text-4xl flex justify-center items-center w-full h-full p-20 text-amber-50">
                    Public weight data coming soon for  {id}
                </p>
            </main>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    //const ssg = generateSSGHelper()
    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("no id");

    //await ssg.posts.getById.prefetch({ id });

    return {
        props: {
            //trpcState: ssg.dehydrate(),
            id,
        },
        };
        };

            export const getStaticPaths = () => {
            return {paths: [], fallback: "blocking"};
        };

            export default SinglePostPage;