"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, SearchIcon, Heart, Menu, X } from "lucide-react";

import Link from "next/link";

import { NAV_ITEMS } from "./data";

const Header = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const pathname = usePathname();
	const activePage = pathname === "/" ? "" : pathname.replace("/", "");

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
	};

	const handleNavClick = () => {
		// Close menu immediately when navigating
		setIsOpen(false);
	};

	return (
		<header className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4'>
			<div className='bg-gray-100 rounded-full px-6 py-3 grid grid-cols-[100px_auto] md:grid-cols-[100px_auto_100px] items-center justify-between w-full'>
				{/* Logo on left */}
				<Link
					href='/'
					className='flex shrink-0 items-center text-lg font-bold text-gray-900 hover:opacity-85 transition-opacity'
					aria-label='LEPA&WANNISTON — на главную'>
					L&W
				</Link>

				{/* Navigation in center - desktop only */}
				<nav className='hidden md:flex justify-center items-center p-1  bg-gray-200 rounded-full'>
					{NAV_ITEMS.map((item) => {
						const isActive = activePage === item.href.replace("/", "");
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
									isActive ? "bg-black text-white" : "bg-gray-200 text-gray-700"
								}`}>
								{item.label}
							</Link>
						);
					})}
				</nav>

				{/* Icons on right */}
				<div className='flex items-center gap-3'>
					<button className='h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300'>
						<SearchIcon className='h-4 w-4' />
					</button>
					<button className='h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300'>
						<Heart className='h-4 w-4' />
					</button>
					<button className='h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300'>
						<ShoppingBag className='h-4 w-4' />
					</button>
					{/* Mobile menu toggle */}
					<div className='relative md:hidden'>
						<button
							className='h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300'
							onClick={() => handleOpenChange(isOpen ? false : true)}>
							{isOpen ? (
								<X className='h-4 w-4 transition-all duration-300' />
							) : (
								<Menu className='h-4 w-4 transition-all duration-300' />
							)}
						</button>

						{/* Custom mobile menu */}
						{/* Mobile menu */}
						<div
							className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4 transition-all duration-300
    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
							<div className='bg-gray-100 rounded-[30px] px-6 py-3 menu-content transition-all duration-300'>
								<nav className='flex flex-col space-y-2'>
									{NAV_ITEMS.map((item) => {
										const isActive = activePage === item.href.replace("/", "");
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={handleNavClick}
												className={`w-full px-4 py-2 text-center text-sm font-medium rounded-full transition-colors duration-300 ${
													isActive
														? "bg-black text-white"
														: "text-gray-700 hover:bg-black hover:text-white"
												}`}>
												{item.label}
											</Link>
										);
									})}
								</nav>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export { Header };
