import { useEffect, useState } from 'react';

function useLocalStorage<T>(initialValue: T, key: string) {
	const [data, setData] = useState<T>(() => {
		const savedValue: string | null = localStorage.getItem(key);
		const normalizedData: T = savedValue ? JSON.parse(savedValue) : initialValue;

		return normalizedData;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(data));
	}, [data, key]);

	return [data, setData];
}

export default useLocalStorage;
