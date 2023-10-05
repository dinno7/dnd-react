import { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTasks } from '../contexts/TaskContext';
import { Task } from '../types';

interface Props {
	task: Task;
}
function TaskItem({ task }: Props) {
	const [isEditMode, setIsEditMode] = useState(false);
	const { updateTask, deleteTask } = useTasks();

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
		disabled: isEditMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	if (isDragging) {
		return (
			<div
				id={task.id + ''}
				ref={setNodeRef}
				style={style}
				className="p-3 rounded-lg min-h-[6.5rem] bg-blue-900/40 border-2 border-blue-500"></div>
		);
	}
	if (isEditMode)
		return (
			<div className="group p-3 rounded-lg min-h-[6.5rem] bg-gray-900 elative border-l-2 border-l-red-300/60">
				<textarea
					onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
						if (e.key === 'Escape') {
							setIsEditMode(false);
							return updateTask(task.id, task.content);
						}
						if (e.ctrlKey && e.key === 'Enter') {
							updateTask(task.id, (e.target as HTMLTextAreaElement).value?.trim());
							setIsEditMode(false);
						}
					}}
					onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
						updateTask(task.id, (e.target as HTMLTextAreaElement).value?.trim());
						setIsEditMode(false);
					}}
					autoFocus
					dir="auto"
					defaultValue={task.content}
					className="w-full h-full overflow-x-hidden overflow-y-auto bg-transparent resize-none focus-within:outline-none"
					name="task"></textarea>
			</div>
		);
	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			onClick={(e) => {
				e.stopPropagation();
				setIsEditMode(true);
			}}
			className="group p-3 rounded-lg min-h-[6.5rem] bg-gray-900 elative overflow-hidden relative">
			<p dir="auto">{task.content}</p>
			<button
				className="absolute p-1.5 transition-opacity rounded opacity-0 group-hover:opacity-100 right-3 top-3 hover:text-red-400 hover:bg-slate-300/20"
				onClick={() => deleteTask(task.id)}>
				<HiOutlineTrash size={20} />
			</button>
		</div>
	);
}

export default TaskItem;
