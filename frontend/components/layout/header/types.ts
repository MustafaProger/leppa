export type MenuName =
	| "design"
	| "dev"
	| "learning"
	| "community"
	| "resources"
	| "tools"
	| "services"
	| "company"
	| null;

export interface NavigationMenuContentProps {
	children: React.ReactNode;
	isOpen?: boolean;
}
