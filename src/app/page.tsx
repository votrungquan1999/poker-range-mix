import AuthRequiredSection from "src/components/AuthRequiredSection";
import Link from "next/link";

export default (async function Home() {
	return (
		<AuthRequiredSection>
			<div className="flex flex-col items-center gap-20 h-full">
				<h1 className="text-3xl text-blue-800 mt-8 font-bold absolute top-0">
					WELCOME TO POKER RANGE MIXING
				</h1>

				<div className="flex flex-1 justify-center flex-col gap-4 items-center">
					<form
						action={async () => {
							"use server";

							// redirect to new session page
						}}
					>
						<button
							type="submit"
							className="px-4 py-2 text-lg font-semibold bg-blue-600 rounded text-white"
						>
							Start new Session
						</button>
					</form>

					{/* 
							TODO: redirect to join existing session page
						*/}
					<Link href="" className="text-blue-600 underline">
						Browse existing Sessions
					</Link>
				</div>
			</div>
		</AuthRequiredSection>
	);
});
