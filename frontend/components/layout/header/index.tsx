"use client";
import { useState, useEffect } from "react";
import { ShoppingBag, Equal, SearchIcon } from "lucide-react";
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { NavigationMenuContentProps } from "./types";

import { MENU_ITEMS } from "./data";
import { useActiveMenu, useHeaderBlur } from "./hooks";

const Header = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useHeaderBlur(isOpen);

	return (
		<header className='fixed top-0 h-11 flex justify-center w-full bg-background/80 backdrop-blur-xl z-50'>
			<div className='w-full max-w-5xl pl-4 flex justify-center gap-6'>
				<div className='flex w-full items-center justify-between'>
					<Link
						href='/'
						className='flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-1 transition-opacity hover:opacity-85'
						aria-label='Lepa and Wanniston — на главную'>
						L&W
					</Link>

					<Menus />
					<Sheet
						open={isOpen}
						onOpenChange={setIsOpen}>
						<div className='flex items-center justify-center px-2 gap-2 relative z-50'>
							<button className='h-9 w-9 flex items-center justify-center text-foreground hover:text-foreground/80 relative'>
								<SearchIcon className='h-4 w-4' />
							</button>
							<button className='h-9 w-9 flex items-center justify-center text-foreground hover:text-foreground/80 relative'>
								<ShoppingBag className='h-4 w-4' />
							</button>
							<SheetTrigger asChild>
								<button className='h-9 w-9 flex items-center justify-center text-foreground hover:text-foreground/80 md:hidden'>
									<Equal className='h-5 w-5' />
								</button>
							</SheetTrigger>
						</div>
						<SheetContent
							side='right'
							className='w-full bg-background/90 backdrop-blur-xl border-none p-0 z-40'>
							<SheetTitle className='sr-only'>Меню</SheetTitle>
							<MobileMenus />
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};

function Menus() {
	const { activeMenu, setActiveMenu, toggleMenu } = useActiveMenu();

	useHeaderBlur(activeMenu);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const nav = target.closest("nav");

			if (!nav) {
				setActiveMenu(null);
			}
		};

		if (activeMenu) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [activeMenu]);

	return (
		<>
			{activeMenu && (
				<div className='fixed top-11 inset-0 bg-black/40 z-40 pointer-events-none' />
			)}
			<div className='h-full hidden md:block'>
				<nav className='relative z-50 flex items-center justify-center h-full'>
					<ul className='flex items-center justify-center space-x-1 list-none h-full'>
						{MENU_ITEMS.map((menu) => (
							<li
								key={menu.category}
								className='h-full m-0'
								onClick={() => toggleMenu(menu.category)}>
								<button
									className={`inline-flex h-full items-center justify-center px-4 py-2 text-xs! transition-colors focus:outline-none cursor-pointer ${
										activeMenu === menu.category
											? "text-foreground"
											: "text-foreground/70 hover:text-foreground"
									}`}>
									{menu.label}
								</button>

								<NavigationMenuContent isOpen={activeMenu === menu.category}>
									<ul className='w-full'>
										<li>
											{menu.items.map((item) => (
												<button
													key={item}
													onClick={(e) => e.preventDefault()}
													className='block group'>
													<div className='mb-3 text-xl font-semibold text-foreground cursor-pointer'>
														{item}
													</div>
												</button>
											))}
										</li>
									</ul>
								</NavigationMenuContent>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</>
	);
}

function MobileMenus() {
	const { activeMenu, toggleMenu } = useActiveMenu();

	return (
		<div className='h-full w-full pt-11 overflow-y-auto'>
			<nav className='flex flex-col'>
				{MENU_ITEMS.map((menu) => (
					<div
						key={menu.category}
						className=''>
						<button
							onClick={() => toggleMenu(menu.category)}
							className='w-full px-6 py-4 text-left text-foreground text-sm hover:bg-accent transition-colors flex justify-between items-center'>
							<span className='font-bold'>{menu.label}</span>
						</button>
						{activeMenu === menu.category && (
							<div className='bg-accent/50 px-6 py-2'>
								{menu.items.map((item) => (
									<a
										key={item}
										href='#'
										onClick={(e) => e.preventDefault()}
										className='block py-2 text-foreground/80 text-sm hover:text-foreground transition-colors'>
										{item}
									</a>
								))}
							</div>
						)}
					</div>
				))}
			</nav>
		</div>
	);
}

// const NavigationMenuContent: React.FC<NavigationMenuContentProps> = ({
// 	children,
// 	isOpen = false,
// }) => {
// 	if (!isOpen) return null;

// 	return (
// 		<div
// 			className={cn(
// 				"fixed left-0 top-11 z-10 w-screen bg-background overflow-hidden",
// 				"grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out",
// 			)}>
// 			<div className="min-h-0">
// 				<div className="w-full max-w-5xl mx-auto py-8 pl-30">
// 					{children}
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

const NavigationMenuContent: React.FC<NavigationMenuContentProps> = ({
	children,
	isOpen = false,
}) => {
	const [mounted, setMounted] = useState(isOpen);
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setMounted(true);
			const timeout = setTimeout(() => {
				setAnimate(true);
			}, 0);
			return () => clearTimeout(timeout);
		} else {
			setAnimate(false);
			const timeout = setTimeout(() => {
				setMounted(false);
			}, 300);
			return () => clearTimeout(timeout);
		}
	}, [isOpen]);

	if (!mounted) return null;

	return (
		<div
			className={cn(
				"fixed left-0 top-11 z-10 w-screen bg-background overflow-hidden",
				"grid transition-[grid-template-rows] duration-300 ease-out",
				animate ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
			)}>
			<div className='min-h-0'>
				<div className='w-full max-w-5xl mx-auto py-8 pl-30'>{children}</div>
			</div>
		</div>
	);
};

export { Header };
