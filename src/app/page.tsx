import Link from "next/link";
import createNewSession from "src/server/actions/createNewSession";

export default (async function Home() {
	return (
		<div className="flex flex-col items-center gap-20 flex-1 relative">
			<h1 className="text-3xl text-blue-800 mt-8 font-bold text-center whitespace-normal absolute top-0">
				WELCOME TO POKER RANGE MIXING
			</h1>

			<div className="flex flex-1 justify-center flex-col gap-4 items-center">
				<form action={createNewSession}>
					<button
						type="submit"
						className="px-4 py-2 text-lg font-semibold bg-blue-600 rounded text-white"
					>
						Start new Session
					</button>
				</form>

				<Link href="/sessions" className="text-blue-600 underline">
					Browse existing Sessions
				</Link>

				<hr className="w-full border-t border-slate-200 self-stretch" />

				<Link href="/randomizer" className="text-blue-600 underline">
					Go to Randomizer
				</Link>
			</div>
		</div>
	);
});
