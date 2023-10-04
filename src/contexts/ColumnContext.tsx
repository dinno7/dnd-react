import { createContext, useContext, useMemo, useState } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import { Column, ID } from '../types';
import { generateId } from '../utils';

interface Props {
	children: React.ReactNode;
}

interface ColumnContext {
	columns: Column[];
	setColumns: Column[] | React.Dispatch<React.SetStateAction<Column[]>>;
	activeColumn: Column | null;
	setActiveColumn: React.Dispatch<React.SetStateAction<Column | null>>;
	columnsId: ID[];
	addNewColumn: () => void;
	deleteColumn: (id: ID) => void;
	updateColumnTitle: (id: ID, title: string) => void;
	deleteAllColumns: () => void;
}

const Context = createContext<ColumnContext>({
	columns: [],
	activeColumn: null,
	setActiveColumn: () => null,
	setColumns: () => null,
	columnsId: [],
	addNewColumn: () => null,
	deleteColumn: () => null,
	updateColumnTitle: () => null,
	deleteAllColumns: () => null,
});

function ColumnContext({ children }: Props) {
	const [columns, setColumns] = useLocalStorage<Column[]>([], 'columns');
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);

	const columnsId = useMemo(() => columns.map((c) => c.id), [columns]);

	function addNewColumn() {
		const id = generateId();
		const newColumn: Column = {
			id,
			title: `Column - ${columns.length + 1}`,
		};

		setColumns((columns) => [...columns, newColumn]);

		setTimeout(() => {
			const newColumnEl = document.getElementById(id);
			newColumnEl?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
		}, 0);
	}

	function deleteColumn(id: ID) {
		setColumns((columns) => columns.filter((c) => c.id !== id));
	}
	function updateColumnTitle(id: ID, title: string) {
		setColumns((columns) => columns.map((column) => (column.id === id ? { ...column, title } : column)));
	}

	function deleteAllColumns() {
		setColumns([]);
	}

	return (
		<Context.Provider
			value={{
				columns,
				setColumns,
				activeColumn,
				setActiveColumn,
				columnsId,
				addNewColumn,
				deleteColumn,
				updateColumnTitle,
				deleteAllColumns,
			}}>
			{children}
		</Context.Provider>
	);
}

export function useColumns() {
	const context = useContext(Context);
	if (!context) throw new Error('Please use useColumns inside it provider!');

	return context;
}

export default ColumnContext;
