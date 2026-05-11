export type MenuName =
	| "catalog"
	| "hits"
	| "new"
	| "reviews"
	| null;

export interface NavigationMenuContentProps {
	children: React.ReactNode;
	isOpen?: boolean;
}
