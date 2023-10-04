import { createContext, useContext, useMemo, useState } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import { ID, Task } from '../types';
import { generateId } from '../utils';

interface Props {
	children: React.ReactNode;
}

interface TaskContextTypes {
	tasks: Task[];
	activeTask: Task | null;
	setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>;
	setTasks: React.Dispatch<React.SetStateAction<Task[] | []>>;
	tasksId: ID[];
	addNewTask: (columnId: ID) => void;
	deleteTask: (id: ID) => void;
	updateTask: (id: ID, content: string) => void;
	getTasksByColumnId: (columnId: ID) => Task[];
	deleteAllTask: () => void;
}

const Context = createContext<TaskContextTypes>({
	tasks: [],
	activeTask: null,
	setActiveTask: () => null,
	setTasks: () => null,
	tasksId: [],
	addNewTask: () => null,
	deleteTask: () => null,
	updateTask: () => null,
	getTasksByColumnId: () => [],
	deleteAllTask: () => null,
});

function TaskContext({ children }: Props) {
	const [tasks, setTasks] = useLocalStorage([], 'tasks');
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const tasksId = useMemo(() => tasks?.map((c) => c.id), [tasks]);

	function addNewTask(columnId: ID) {
		const id = generateId();
		const newTask: Task = {
			id,
			columnId,
			date: new Date(),
			content: `Task - ${tasks.length + 1}`,
		};

		setTasks((tasks) => [...tasks, newTask]);

		setTimeout(() => {
			const newTaskEl = document.getElementById(id);
			newTaskEl?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
		}, 0);
	}

	function deleteTask(id: ID) {
		setTasks((tasks) => tasks.filter((c) => c.id !== id));
	}
	function updateTask(id: ID, content: string) {
		if (!content) content = 'Task can not be empty!';
		setTasks((tasks) => tasks.map((task) => (task.id === id ? { ...task, content } : task)));
	}

	function getTasksByColumnId(columnId: ID) {
		return tasks.filter((task) => task.columnId === columnId);
	}

	function deleteAllTask() {
		setTasks([]);
	}

	return (
		<Context.Provider
			value={{
				tasks,
				setTasks,
				activeTask,
				setActiveTask,
				tasksId,
				addNewTask,
				deleteTask,
				updateTask,
				getTasksByColumnId,
				deleteAllTask,
			}}>
			{children}
		</Context.Provider>
	);
}

export function useTasks() {
	const context = useContext(Context);
	if (!context) throw new Error('Please use useTasks inside it provider!');

	return context;
}

export default TaskContext;
