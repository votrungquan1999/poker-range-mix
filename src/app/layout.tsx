import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Poker Range Mixing",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{/* the layout that narrow the page */}
				<div className="flex flex-row justify-center bg-slate-100">
					{/* the white background section, containing the main page and the footer */}
					<div className="max-w-3xl w-full min-h-screen flex flex-col bg-white px-10">
						{children}

						<footer className="border-t border-blue-100 p-1">
							<p>
								Made with <span className="text-red-600">❤</span> by{" "}
								<a
									href="https://github.com/votrungquan1999"
									className="underline text-blue-600"
									target="https://github.com/votrungquan1999"
								>
									Quan Vo
								</a>
							</p>
						</footer>
					</div>
				</div>
			</body>
		</html>
	);
}
