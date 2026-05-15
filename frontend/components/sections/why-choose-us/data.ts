import { BadgeCheck, BadgePercent, Headphones, Truck } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type WhyChooseUsItem = {
	title: string;
	description: string;
	icon: LucideIcon;
};

export const whyChooseUsItems: WhyChooseUsItem[] = [
	{
		title: "Качество",
		description:
			"Продукты соответствуют международным стандартам и проходят контроль качества",
		icon: BadgeCheck,
	},
	{
		title: "Поддержка",
		description: "Наша команда предоставляет профессиональные консультации",
		icon: Headphones,
	},
	{
		title: "Цены",
		description: "Лучшие цены на рынке без компромиссов в качестве",
		icon: BadgePercent,
	},
	{
		title: "Надежность",
		description:
			"Быстрая доставка и стабильный сервис, на который можно положиться",
		icon: Truck,
	},
];
