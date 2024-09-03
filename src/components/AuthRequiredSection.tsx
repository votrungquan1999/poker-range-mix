import type { ReactNode } from "react";
import type React from "react";
import { auth, signIn } from "src/auth";

export default async function AuthRequiredSection({
	children,
}: { children: ReactNode }) {
	const session = await auth();

	if (!session) {
		return (
			<div className="w-full flex flex-col gap-4">
				<p className="text-amber-600 text-xl">
					You need to sign in to access this page
				</p>

				<form
					action={async () => {
						"use server";
						await signIn();
					}}
				>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Sign in
					</button>
				</form>
			</div>
		);
	}

	return <>{children}</>;
}
