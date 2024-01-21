import {signIn, signOut, useSession} from "next-auth/react";
import Head from "next/head";
import {api} from "~/utils/api";
import {useState} from "react";

export default function Home() {
    const {data: sessionData} = useSession();

    const {data, isLoading, isError} = api.weight.getWeights.useQuery({enabled: !!sessionData});


    const {
        data: isWeightEntered,
        isLoading: isWeightEnteredPending,
        isError: isWeightEnteredInError
    } = api.weight.weightForTodayEntered.useQuery({enabled: !!sessionData});


    return (
        <>
            <Head>
                <title>Weight Tracker</title>
                <meta name="description" content="Generated by create-t3-app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="min-h-screen  items-start justify-center bg-gradient-to-b from-[#12162C] to-[#15162c]">
                <nav className="flex justify-between w-full">
                    <h1 className="p-4 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        Weight <span className="text-[hsl(200,100%,40%)]">Tracker</span>
                    </h1>
                    <div>
                        <AuthModule/>
                    </div>
                </nav>
                {sessionData ?
                    <div>
                        {isWeightEnteredPending ? <Loading/> : isWeightEnteredInError ?
                            <WeightError/> : isWeightEntered ?
                                <WeightEntered/> :
                                <WeightForm/>
                        }
                        {isLoading ? <Loading/> : isError ? <div>Error Fetching weights.</div> :
                            <WeightList weightResult={data}/>}
                    </div> :
                    <p className="text-4xl flex justify-center items-center w-full h-full p-20 text-amber-50">Please
                        sign in
                        or sign up to track weight.</p>}
            </main>
        </>
    );
}

export function WeightForm() {
    const {mutate, error} = api.weight.create.useMutation();
    const [isFormSubmitted, setFormSubmitted] = useState(false);

    if (error) {
        return <WeightError/>
    }

    if (isFormSubmitted) {
        return <WeightEntered/>
    }

    return (
        <div className="w-1/5 mx-auto p-2">
            <form
                className="flex flex-col items-center justify-center text-amber-50 bg-blue-400 border border-gray-300 rounded-md"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    console.log(formData);
                    mutate({weight: Number(formData.get('weight'))});
                    setFormSubmitted(true);
                }}>
                <label htmlFor="weight" className="mb-2 text-lg">Enter weight
                    for {new Date().toLocaleDateString()}</label>
                <input name="weight" id="weight" type="number" min="100" max="499" step="0.1"
                       className="mb-2 p-2 border border-gray-300 rounded-md text-blue-900"/>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
            </form>
        </div>
    )
}

function WeightList({weightResult}: {
    weightResult: { id: number, weight: number, createdAt: Date, updatedAt: Date, createdById: string }[]
}) {
    if (weightResult.length === 0) {
        return <p className="text-4xl flex justify-center items-center w-full h-full p-20 text-amber-50">No weights
            found, please enter one.</p>;
    }

    const preppedTableData: { createdAt: Date, id: number, weight: number, style: string, indicator: string }[] = [];
    weightResult.forEach((weight, i) => {
        const entry: { id: number, createdAt: Date, weight: number, style: string, indicator: string } = {} as {
            id: number,
            createdAt: Date,
            weight: number,
            style: string,
            indicator: string
        };
        entry.createdAt = weight.createdAt;
        entry.id = weight.id;
        entry.weight = weight.weight;
        if (i < weightResult.length - 1) {
            if (weightResult[i]!.weight > weightResult[(i + 1)]!.weight) {
                entry.indicator = "▲";
                entry.style = "text-green-500";
            } else if (weightResult[i]!.weight < weightResult[(i + 1)]!.weight) {
                entry.indicator = "▼";
                entry.style = "text-red-500";
            } else {
                entry.indicator = " --"
                entry.style = "text-3xl text-blue-500";
            }
        } else {
            entry.indicator = " --"
            entry.style = "text-3xl text-blue-500";
        }
        console.log(entry)
        preppedTableData.push(entry);
    })
    return (
        <div className="w-1/3 mx-auto p-20">
            <table className="min-w-full divide-y divide-gray-200 text-center">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight (lbs)
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">

                {preppedTableData.map((entry) => (
                    <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-2xl text-gray-500">{entry.weight} <span
                                className={entry.style}>{entry.indicator}</span></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div
                                className="text-2xl text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
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

function WeightEntered() {
    return <div className="text-3xl flex flex-col items-center justify-center text-amber-50 p-8">Weight Entered
        for {new Date().toLocaleDateString()}</div>
}

function Loading() {
    return <div className="flex justify-center items-center w-full h-full p-20">
        <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-green-300"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>

}

function WeightError() {
    return <div className="text-3xl flex flex-col items-center justify-center text-amber-50 p-8"><p>There was an error
        checking if weight was entered for today.</p>
        <p>Report any issues on <a href={"https://github.com/forrestdevelops/weight-status/issues"}
                                   className="text-[hsl(200,100%,40%)]">github</a>.</p>
    </div>
}
