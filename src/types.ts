export type ID = number | string;

export interface Column {
	id: ID;
	title: string;
}

export interface Task {
	id: ID;
	columnId: ID;
	content: string;
}
