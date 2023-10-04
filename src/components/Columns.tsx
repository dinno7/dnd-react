import { SortableContext } from '@dnd-kit/sortable';

import { useColumns } from '../contexts/ColumnContext';
import ColumnItem from './ColumnItem';

function Columns() {
	const { columns, columnsId } = useColumns();
	return (
		<SortableContext items={columnsId}>
			{columns.map((col) => (
				<ColumnItem key={col.id} column={col} />
			))}
		</SortableContext>
	);
}

export default Columns;
