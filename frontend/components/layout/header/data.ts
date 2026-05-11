import { MenuName } from "./types";

export const MENU_ITEMS: Array<{
	category: MenuName;
	label: string;
	items: string[];
}> = [
	{
		category: "design",
		label: "Design",
		items: ["UI/UX", "Branding", "Prototypes"],
	},
	{
		category: "dev",
		label: "Development",
		items: ["Frontend", "Backend", "DevOps"],
	},
	{
		category: "learning",
		label: "Learning",
		items: ["Tutorials", "Courses", "Blogs"],
	},
	{
		category: "community",
		label: "Community",
		items: ["Forums", "Discord", "GitHub"],
	},
	{
		category: "resources",
		label: "Resources",
		items: ["Documentation", "API Reference", "Changelog"],
	},
	{
		category: "tools",
		label: "Tools",
		items: ["Figma", "Sketch", "Photoshop"],
	},
	{
		category: "services",
		label: "Services",
		items: ["Consulting", "Workshops", "Support"],
	},
	{
		category: "company",
		label: "Company",
		items: ["About Us", "Careers", "Contact"],
	},
];
