import Board from './components/Board';
import ColumnContext from './contexts/ColumnContext';
import TaskContext from './contexts/TaskContext';

function App() {
	return (
		<div className="flex flex-col items-center justify-start w-full h-screen gap-10">
			<div className="text-center">
				<h1 className="mt-10 text-6xl font-bold">Dinno Board</h1>
				<h3 className="py-5 text-xl">Data will save on your browser, you can refresh easy</h3>
				<div className="text-left text-gray-400 ">
					<ul className="grid justify-between grid-cols-[repeat(2,max-content)]">
						<li>Add new column</li>
						<li>Add new task </li>
						<li>Edit column's name</li>
						<li>Edit tasks</li>
						<li>Delete task and column</li>
						<li>Drag task and column</li>
					</ul>
				</div>
			</div>
			<ColumnContext>
				<TaskContext>
					<Board />
				</TaskContext>
			</ColumnContext>
		</div>
	);
}

export default App;
