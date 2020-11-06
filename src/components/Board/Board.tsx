import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";

import { Task } from "./components/Task";
import { Column } from "./components/Column";
import { AddColumnBtn } from "./components/AddColumnBtn";
import { useRecoilState } from "recoil";
import { columnsState, IColumn } from "../../store/entities";
import { moveBetween, reorder } from "../../utils/array";

const COLUMNS_HORIZONTAL = "columns-horizontal";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flex: 1,
    padding: `0 ${theme.spacing(1)}px`,
    backgroundColor: theme.palette.background.default,
  },
  addColumnBtnWrapper: {
    alignSelf: "flex-start",
    marginTop: theme.spacing(1.5),
    width: 300,
  },
  t: {
    minHeight: 32,
  },
}));

export const Board = () => {
  const classes = useStyles();
  const [columns, setColumns] = useRecoilState(columnsState);
  // TODO: investigate animation jumping when recoil data is used directly
  const [columnsOnBoard, setColumnsOnBoard] = useState(columns);

  const moveColumns = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const reorderedColumns = reorder(
      columnsOnBoard,
      source.index,
      destination.index
    );

    setColumnsOnBoard(reorderedColumns);
    setColumns(reorderedColumns);
  };
  const moveTasksInTheSameColumn = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const updatingColumn = columnsOnBoard.find(
      (column) => column.id === source.droppableId
    );

    if (!updatingColumn) {
      return;
    }

    const reorderedTasks = reorder(
      updatingColumn.tasks,
      source.index,
      destination.index
    );

    const updateColumns = (columns: IColumn[]) =>
      columns.map((column) => {
        if (column.id === updatingColumn.id) {
          return {
            ...column,
            tasks: reorderedTasks,
          };
        }

        return { ...column };
      });

    setColumnsOnBoard(updateColumns);
    setColumns(updateColumns);
  };

  const moveTaskToAnotherColumn = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const sourceColumn = columnsOnBoard.find(
      (column) => column.id === source.droppableId
    );
    const destinationColumn = columnsOnBoard.find(
      (column) => column.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    const { updatedSource, updatedDestination } = moveBetween(
      sourceColumn.tasks,
      destinationColumn.tasks,
      source,
      destination
    );

    const updateColumns = (columns: IColumn[]) =>
      columns.map((column) => {
        if (column.id === source.droppableId) {
          return { ...column, tasks: updatedSource };
        }

        if (column.id === destination.droppableId) {
          return { ...column, tasks: updatedDestination };
        }

        return { ...column };
      });

    setColumnsOnBoard(updateColumns);
    setColumns(updateColumns);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    if (sourceId === destinationId) {
      sourceId === COLUMNS_HORIZONTAL
        ? moveColumns(source, destination)
        : moveTasksInTheSameColumn(source, destination);
      return;
    }

    moveTaskToAnotherColumn(source, destination);
  };

  useEffect(() => {
    setColumnsOnBoard(columns);
  }, [setColumnsOnBoard, columns]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId={COLUMNS_HORIZONTAL}
        direction="horizontal"
        type="column"
      >
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            className={classes.wrapper}
            variant="outlined"
            {...provided.droppableProps}
          >
            {columnsOnBoard.map((column, j) => (
              <Draggable
                draggableId={column.id + "col"}
                index={j}
                key={column.id + "col"}
              >
                {(provided) => (
                  <Column
                    ref={provided.innerRef}
                    title={column.title}
                    columnId={column.id}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Droppable droppableId={column.id} type="tasks">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={classes.t}
                        >
                          {column.tasks.map((task, i) => (
                            <Draggable
                              draggableId={task.id + "task"}
                              index={i}
                              key={task.id + "task"}
                            >
                              {(provided) => (
                                <Task
                                  taskId={task.id}
                                  columnId={column.id}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {task.description}
                                </Task>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Column>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className={classes.addColumnBtnWrapper}>
              <AddColumnBtn />
            </div>
          </Paper>
        )}
      </Droppable>
    </DragDropContext>
  );
};
