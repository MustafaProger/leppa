import { useEffect, useState } from "react";
import { MenuName } from "./types";

export function useHeaderBlur(isOpen: boolean | MenuName) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			const main = document.querySelector("main");
			if (main) {
				(main as HTMLElement).style.filter = "blur(2px)";
			}
		} else {
			document.body.style.overflow = "";
			const main = document.querySelector("main");
			if (main) {
				(main as HTMLElement).style.filter = "none";
			}
		}
		return () => {
			document.body.style.overflow = "";
			const main = document.querySelector("main");
			if (main) {
				(main as HTMLElement).style.filter = "none";
			}
		};
	}, [isOpen]);
}

export function useActiveMenu() {
	const [activeMenu, setActiveMenu] = useState<MenuName>(null);

	const toggleMenu = (menu: MenuName) => {
		setActiveMenu((prev) => (prev === menu ? null : menu));
	};

	return { activeMenu, setActiveMenu, toggleMenu };
}
