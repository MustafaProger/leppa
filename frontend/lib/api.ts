import categoriesData from "@/data/mock/categories.json";
import contactsData from "@/data/mock/contacts.json";

import type { Category, Contacts } from "@/types";

export async function getCategories(): Promise<Category[]> {
	try {
		return categoriesData;
	} catch (error) {
		console.error("Failed to get categories", error);

		throw error;
	}
}

export async function getContacts(): Promise<Contacts> {
	try {
		return contactsData;
	} catch (error) {
		console.error("Failed to get contacts", error);

		throw error;
	}
}
