import * as React from 'react';
// @ts-ignore-line
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Measure from 'react-measure';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import * as styles from './Grid.scss';
import HelpDialog from '../helpDialog/HelpDialog.component';
import { DataRow } from '../generator/generator.reducer';
import { DataTypeFolder } from '../../_plugins';
import GridRow from './GridRow.container';


const SMALL_BREAKPOINT = 650;
const MEDIUM_BREAKPOINT = 780;

export type GridProps = {
	rows: DataRow[];
	onAddRows: (numRows: number) => void;
	onSelectDataType: (dataType: DataTypeFolder, id?: string) => void;
	onSort: (id: string, newIndex: number) => void;
	toggleGrid: () => void;
	i18n: any;
	countryI18n: any;
	dataTypeI18n: any;
	columnTitle: string;
	loadedDataTypes: any; // TODO
};


const Grid = ({
	rows, onAddRows, onSelectDataType, onSort, i18n, countryI18n, dataTypeI18n, columnTitle, toggleGrid
}: GridProps): JSX.Element => {
	const [numRows, setNumRows] = React.useState(1);
	const [helpDialogVisible, showHelpDialog] = React.useState(false);
	const [initialHelpSection, setInitialDialogSection] = React.useState('');
	const [dimensions, setDimensions] = React.useState<any>({ height: 0, width: 0 });

	let gridSizeClass = '';
	if (dimensions.width < SMALL_BREAKPOINT) {
		gridSizeClass = styles.gridSmall;
	} else if (dimensions.width < MEDIUM_BREAKPOINT) {
		gridSizeClass = styles.gridMedium;
	}

	const addRowsBtnLabel = numRows === 1 ? i18n.row : i18n.rows;

	return (
		<>
			<div style={{ position: 'fixed', right: 0, padding: 10 }} onClick={toggleGrid}>
				<Tooltip title={i18n.closePanel} placement="bottom">
					<IconButton size="small" aria-label={i18n.closePanel}>
						<CloseIcon fontSize="large" />
					</IconButton>
				</Tooltip>
			</div>

			<Measure
				bounds
				onResize={(contentRect: any): void => setDimensions(contentRect.bounds)}
			>
				{({ measureRef }): any => (
					<div className={`${styles.gridWrapper} ${gridSizeClass}`} ref={measureRef}>
						<div>
							<div className={styles.gridHeaderWrapper}>
								<div className={`${styles.gridRow} ${styles.gridHeader}`} style={{ flex: `0 0 auto` }}>
									<div className={styles.orderCol}>{rows.length}</div>
									<div className={styles.dataTypeCol}>
										{i18n.dataType}
									</div>
									<div className={styles.titleCol}>{columnTitle}</div>
									<div className={styles.examplesCol}>{i18n.examples}</div>
									<div className={styles.optionsCol}>{i18n.options}</div>
									<div className={styles.helpCol} />
									<div className={styles.deleteCol} />
								</div>
							</div>
						</div>
						<div className={styles.scrollableGridRows}>
							<div className={styles.gridRowsWrapper}>
								<DragDropContext onDragEnd={({ draggableId, destination }: any): any => onSort(draggableId, destination.index)}>
									<Droppable droppableId="droppable">
										{(provided: any): any => (
											<div
												className={styles.grid}
												{...provided.droppableProps}
												ref={provided.innerRef}
											>
												{rows.map((row, index) => (
													<GridRow
														row={row}
														key={row.id}
														index={index}
														dimensions={dimensions}
													/>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>

								<form onSubmit={(e): any => e.preventDefault()} className={styles.addRows}>
									<span>{i18n.add}</span>
									<input type="number"
										value={numRows}
										onChange={(e): void => setNumRows(parseInt(e.target.value, 10))}
										min={1}
										max={1000}
										step={1}
									/>
									<Button
										size="small"
										onClick={(): void => onAddRows(numRows)}
										variant="contained"
										color="primary"
										disableElevation>
										{addRowsBtnLabel}
									</Button>
								</form>
							</div>
						</div>
						<HelpDialog
							visible={helpDialogVisible}
							initialDataType={initialHelpSection}
							onClose={(): any => showHelpDialog(false)}
							coreI18n={i18n}
							dataTypeI18n={dataTypeI18n}
							onSelectDataType={onSelectDataType}
						/>
					</div>
				)}
			</Measure>
		</>
	);
};

export default Grid;
