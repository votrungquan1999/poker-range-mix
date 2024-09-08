import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import { auth, signOut } from "src/auth";

export default async function UserAccount() {
	const session = await auth();

	if (!session) {
		return null;
	}

	return (
		<div>
			<Popover.Root>
				<Popover.Trigger>
					<Image
						src={session.user.image}
						alt="User avatar"
						className="rounded-full cursor-pointer h-10 w-10"
						width={40}
						height={40}
					/>
				</Popover.Trigger>
				<Popover.Anchor />
				<Popover.Portal>
					<Popover.Content className="border border-slate-200 shadow rounded px-4 py-2 bg-white flex flex-col divide-y divide-slate-200">
						<div className="flex flex-row gap-4 items-center p-2">
							<Image
								src={session.user.image}
								alt="User avatar"
								className="rounded-full"
								width={40}
								height={40}
							/>
							<div>
								<p className="text-lg font-semibold">{session.user.name}</p>
								<p className="text-slate-600">{session.user.email}</p>
							</div>
						</div>

						{/* log out button */}

						<form
							className="p-2"
							action={async () => {
								"use server";

								await signOut();
							}}
						>
							<button
								type="submit"
								className="w-full px-2 py-1 text-lg text-red-600 rounded border border-red-600 hover:bg-red-100 flex flex-row gap-2 items-center justify-center"
							>
								<ArrowRightStartOnRectangleIcon className="w-6 h-6" />
								Log Out
							</button>
						</form>

						<Popover.Close />
						<Popover.Arrow className="fill-white " />
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		</div>
	);
}
