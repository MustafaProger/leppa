"use client";

import { useState } from "react";

interface AccordionProps {
	title: string;
	children: React.ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className='border-b border-neutral-line mb-2'>
			<button
				className='w-full flex justify-between items-center py-4 text-left font-medium text-lg text-neutral-heading hover:text-neutral-heading-muted'
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
				<div className='text-neutral-body'>{children}</div>
			</div>
		</div>
	);
}
