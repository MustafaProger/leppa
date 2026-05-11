import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Lepa and Wanniston",
	description:
		"Premium minimal storefront for modern bathroom and kitchen products.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='ru'
			className={cn("h-full scroll-smooth", "font-sans")}>
			<body className='min-h-full min-w-80 bg-background text-foreground antialiased'>
				{/* <div className='px-3 sm:px-5'> */}
				<Header />
				<main>{children}</main>
				{/* </div> */}
			</body>
		</html>
	);
}
