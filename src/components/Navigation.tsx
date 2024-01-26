
import {signIn, signOut, useSession} from "next-auth/react";
import {api} from "~/utils/api";
export default function Navigation() {
    return (
    <nav className="flex justify-between w-full">
        <h1 className="p-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Weight <span className="text-[hsl(200,100%,40%)]">Tracker</span>
        </h1>
        <div>
            <AuthModule/>
        </div>
    </nav>)
}

function AuthModule() {
    const {data: sessionData} = useSession();

    const {data: secretMessage} = api.weight.getProtectedMessage.useQuery(
        undefined, // no input
        {enabled: sessionData?.user !== undefined}
    );

    return (
        <div className="flex flex-row gap-4 p-8 bg">
            <p className="text-center text-2xl text-white p-2">
            {secretMessage && <span> {secretMessage}</span>} {sessionData &&
                <span>{sessionData.user?.name ? sessionData.user?.name : sessionData.user?.email}</span>}
            </p>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
}