"use client";

import { useEffect, useState } from "react";

type AsyncFunction<T> = () => Promise<T>;

type UseApiReturn<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
};

export function useApi<T>(apiFunction: AsyncFunction<T>): UseApiReturn<T> {
	const [data, setData] = useState<T | null>(null);

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);

				const response = await apiFunction();

				setData(response);
			} catch (error) {
				console.error(error);

				setError("Something went wrong");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [apiFunction]);

	return {
		data,
		loading,
		error,
	};
}
