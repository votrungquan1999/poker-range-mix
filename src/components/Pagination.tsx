import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { redirect } from "next/navigation";

export default function Pagination({
	currentPage,
	pages,
}: {
	pages: number;
	currentPage: number;
}) {
	return (
		<div className="flex flex-row items-center gap-4">
			<form
				action={async function goToPreviousPage() {
					"use server";

					redirect(`?currentPage=${currentPage - 1}`);
				}}
			>
				<button
					type="submit"
					className={clsx(
						"px-1 py-px text-blue-600 border border-blue-600 font-semibold rounded shadow hover:bg-blue-100",
						{
							"opacity-50 cursor-default": currentPage === 1,
						},
					)}
				>
					<ChevronLeftIcon className="w-6 h-6" />
				</button>
			</form>

			<p>
				Page {currentPage} of {pages}
			</p>

			<form
				action={async function goToNextPage() {
					"use server";

					redirect(`?currentPage=${currentPage + 1}`);
				}}
			>
				<button
					type="submit"
					className={clsx(
						"px-1 py-px text-blue-600 border border-blue-600 font-semibold rounded shadow hover:bg-blue-100",
						{
							"opacity-50 cursor-default": currentPage === pages,
						},
					)}
				>
					<ChevronRightIcon className="w-6 h-6" />
				</button>
			</form>
		</div>
	);
}
