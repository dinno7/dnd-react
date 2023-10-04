import { HiOutlinePlusCircle } from 'react-icons/hi2';

import { useColumns } from '../contexts/ColumnContext';
import { useTasks } from '../contexts/TaskContext';
import GroupButtons from './GroupButtons';

function ActionButtons() {
	const { columns, addNewColumn, deleteAllColumns } = useColumns();
	const { tasks, deleteAllTask } = useTasks();
	return (
		<div
			className={`fixed flex gap-5 items-center flex-col -translate-x-1/2 left-1/2 ${
				columns.length ? 'bottom-20' : 'bottom-1/2 translate-y-1/2'
			}`}>
			<button
				className={`  flex items-center justify-start gap-2 p-3 rounded-md  max-w-max bg-blue-500/80 hover:bg-blue-500/80 transition-colors text-slate-50 ${
					columns.length ? 'bottom-20' : 'bottom-1/2 translate-y-1/2 animate-bounce'
				}`}
				onClick={addNewColumn}>
				<HiOutlinePlusCircle size={20} />
				{columns.length <= 0 ? <span>Add first Column</span> : <span>Add new column</span>}
			</button>

			{columns.length > 0 && (
				<GroupButtons>
					<button className="p-3 bg-rose-600 hover:bg-rose-500" onClick={deleteAllColumns}>
						Delete Columns
					</button>
					{tasks.length > 0 && (
						<>
							<button
								className="p-3 bg-rose-600 hover:bg-rose-500 border-x-2 border-x-rose-300"
								onClick={deleteAllTask}>
								Delete Tasks
							</button>
							<button
								className="p-3 bg-rose-600 hover:bg-rose-500"
								onClick={() => {
									deleteAllColumns();
									deleteAllTask();
								}}>
								Delete All
							</button>
						</>
					)}
				</GroupButtons>
			)}
		</div>
	);
}

export default ActionButtons;
