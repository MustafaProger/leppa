"use client";

import { useState } from "react";

interface AccordionProps {
	title: string;
	children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='border-b border-gray-200 mb-2'>
			<button
				className='w-full flex justify-between items-center py-4 text-left font-medium text-lg text-gray-900 hover:text-gray-700'
				onClick={() => setIsOpen(!isOpen)}>
				{title}
				<span
					className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
					+
				</span>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ${
					isOpen ? "max-h-96 py-2" : "max-h-0"
				}`}>
				<div className='text-gray-700'>{children}</div>
			</div>
		</div>
	);
}
