import { motion } from 'framer-motion';
import { KeyboardEvent, useEffect, useState } from 'react';
import { HiOutlinePlusCircle, HiOutlineTrash, HiXCircle } from 'react-icons/hi2';

import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useColumns } from '../contexts/ColumnContext';
import { useTasks } from '../contexts/TaskContext';
import { Column } from '../types';
import TaskItem from './TaskItem';

interface ColumnItemProps {
	column: Column;
}
function ColumnItem({ column }: ColumnItemProps) {
	const { deleteColumn, updateColumnTitle } = useColumns();
	const { addNewTask, getTasksByColumnId } = useTasks();
	const [isEditMode, setIsEditMode] = useState(false);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		},
		disabled: isEditMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const relatedTasks = getTasksByColumnId(column.id);

	if (isDragging) {
		return (
			<div
				id={column.id}
				ref={setNodeRef}
				style={style}
				className="overflow-hidden rounded-lg w-[25rem] bg-blue-500/20 h-[35rem] border-2 border-blue-500/80"></div>
		);
	}

	return (
		<div
			id={column.id}
			// initial={isFirst ? { opacity: 0, scale: 0.5, y: '-500px' } : {}}
			// animate={isFirst ? { opacity: 1, scale: 1, y: 0 } : {}}
			// transition={isFirst ? { easings: true, duration: 0.3 } : {}}
			ref={setNodeRef}
			style={style}
			className="flex flex-col  rounded-lg w-[25rem] bg-columnBackgroundColor h-[35rem] relative z-10">
			<div
				{...attributes}
				{...listeners}
				onClick={() => setIsEditMode(true)}
				className="flex items-center p-5 m-1 rounded-lg bg-mainBackgroundColor peer">
				{isEditMode ? (
					<div className="relative w-10/12">
						<input
							className="w-full px-3 py-2 rounded-md bg-slate-600/50 caret-slate-400 text-slate-200 focus-within:outline-none"
							type="text"
							autoFocus
							defaultValue={column.title}
							onKeyDown={(e: KeyboardEvent<HTMLInputElement> & { target: { value: string } }) => {
								if (e.key === 'Enter') {
									updateColumnTitle?.(column.id, e.target.value);
									setIsEditMode(false);
								}
							}}
							onBlur={(e) => {
								if (e.relatedTarget?.id !== 'ignore-edit-btn') {
									updateColumnTitle?.(column.id, e.target.value);
									setIsEditMode(false);
								}
							}}
						/>
						<button
							id="ignore-edit-btn"
							onClick={(e) => {
								e.stopPropagation();
								setIsEditMode(false);
							}}
							className="absolute text-red-500 transition-colors -translate-y-1/2 hover:text-red-400 right-2 top-1/2 z-60">
							<HiXCircle size={26} />
						</button>
					</div>
				) : (
					<span className="text-xl font-bold"> {column.title}</span>
				)}
				<button
					className="p-1.5 ml-auto rounded cursor-pointer text-slate-400 hover:text-red-400 hover:bg-slate-700"
					onClick={() => deleteColumn(column.id)}>
					<HiOutlineTrash size={22} />
				</button>
			</div>
			<span
				{...attributes}
				{...listeners}
				className="absolute w-20 left-1/2 -translate-x-1/2 h-5 bottom-full flex items-center justify-center before:content-[''] before:w-10 before:h-1 hover:before:bg-slate-400/80 peer-hover:before:bg-slate-400/80 before:transition-colors before:bg-slate-500/80 before:rounded-full"></span>

			<div className="flex flex-col flex-grow gap-2 m-1 mt-6 overflow-y-auto">
				<SortableContext items={relatedTasks}>
					{relatedTasks.map((task) => (
						<TaskItem key={task.id} task={task} />
					))}
				</SortableContext>
			</div>
			<button
				onClick={() => addNewTask(column.id)}
				className="flex items-center justify-start gap-3 p-3 m-1 transition-colors rounded-lg bg-slate-700/50 hover:bg-slate-700/80">
				<HiOutlinePlusCircle size={24} />
				<span>Add new Task</span>
			</button>
		</div>
	);
}

export default ColumnItem;
