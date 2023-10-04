import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { useColumns } from '../contexts/ColumnContext';
import { useTasks } from '../contexts/TaskContext';
import ActionButtons from './ActionButtons';
import ColumnItem from './ColumnItem';
import Columns from './Columns';
import TaskItem from './TaskItem';

function Board() {
	const { columns, setColumns, activeColumn, setActiveColumn } = useColumns();
	const { activeTask, setActiveTask, tasks, setTasks } = useTasks();
	const containerRef = useRef<HTMLDListElement>(null);

	useEffect(() => {
		function handleFn(e: WheelEvent) {
			if (!containerRef.current) return;

			const hasHorizontalScroll = containerRef.current.clientWidth >= window.innerWidth;
			if (!hasHorizontalScroll || e.target.id !== 'container') return;
			containerRef.current.scrollLeft += e.deltaY * 5;
		}

		document.documentElement.addEventListener('wheel', handleFn);
		return () => document.documentElement.removeEventListener('wheel', handleFn);
	}, [columns.length]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5, // 5px
			},
		}),
	);

	function handleDragStart(e: DragStartEvent) {
		if (e.active.data.current?.type === 'Column') setActiveColumn?.(e.active.data.current.column);
		else if (e.active.data.current?.type === 'Task') setActiveTask(e.active.data.current?.task);
	}

	function handleDragEnd(e: DragEndEvent) {
		setActiveColumn(null);
		setActiveTask(null);
		const { active, over } = e;

		if (!over || active.id === over.id) return;

		if (active.data.current?.type === 'Column') {
			const activeIndex = columns.findIndex((c) => c.id === active.id);
			const overIndex = columns.findIndex((c) => c.id === over.id);

			if (activeIndex === -1 || overIndex === -1) return;

			const newColumns = arrayMove(columns, activeIndex, overIndex);

			setColumns(newColumns);
		} else if (active.data.current?.type === 'Task') {
			const activeIndex = tasks.findIndex((t) => t.id === active.id);
			const overIndex = tasks.findIndex((t) => t.id === over.id);

			if (over.data.current?.type === 'Task') {
				if (activeIndex === -1 || overIndex === -1) return;

				let newTasks = arrayMove(tasks, activeIndex, overIndex);

				newTasks = newTasks.map((task) =>
					task.id === active.id ? { ...task, columnId: over.data.current?.task.columnId } : task,
				);
				setTasks(newTasks);
			} else if (over.data.current?.type === 'Column') {
				setTasks((tasks) => tasks.map((task) => (task.id === active.id ? { ...task, columnId: over.id } : task)));
			}
		}
	}
	return (
		<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="grid h-full overflow-x-auto overflow-y-hidden" ref={containerRef}>
				<div id="container" className="relative flex gap-10 px-10 mx-auto overflow-x-auto overflow-y-hidden">
					<Columns />
					<ActionButtons />
				</div>
				{activeColumn && createPortal(<DragOverlay>{<ColumnItem column={activeColumn} />}</DragOverlay>, document.body)}
				{activeTask && createPortal(<DragOverlay>{<TaskItem task={activeTask} />}</DragOverlay>, document.body)}
			</div>
		</DndContext>
	);
}

export default Board;
