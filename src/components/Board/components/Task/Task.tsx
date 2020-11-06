import React, {
  ChangeEvent,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Task as TaskType } from "../../../../core/entities/Task";
import { Column as ColumnType } from "../../../../core/entities/Column";
import { useSetRecoilState } from "recoil";
import { columnsState } from "../../../../store/entities";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: 64,
    padding: `${theme.spacing(0.5)}px`,
    margin: `${theme.spacing(0.5)}px 0`,
    backgroundColor: theme.palette.success.light,
  },
  removeTaskBtnWrapper: {
    display: "flex",
  },
  removeTaskBtn: {
    marginLeft: "auto",
  },
}));

type TaskProps = RefAttributes<HTMLElement> & {
  taskId: TaskType["id"];
  columnId: ColumnType["id"];
  children?: TaskType["description"];
};

export const Task: ForwardRefExoticComponent<TaskProps> = forwardRef(
  ({ taskId, columnId, children, ...rest }, ref) => {
    const classes = useStyles();
    const setColumns = useSetRecoilState(columnsState);
    const [inputValue, setInputValue] = useState(children);
    const [isEditingMode, setIsEditingMode] = useState(!children);

    const onDescriptionClick = () => setIsEditingMode(true);

    const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setInputValue(value);
    };

    const onDescriptionBlur = () => {
      const newDescription = inputValue || children;

      if (!newDescription) {
        return;
      }

      setInputValue(newDescription);
      setIsEditingMode(false);
      setColumns((columns) =>
        columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, description: newDescription }
                  : { ...task }
              ),
            };
          }

          return { ...column };
        })
      );
    };

    const removeTask = () => {
      setColumns((columns) =>
        columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== taskId),
            };
          }

          return { ...column };
        })
      );
    };

    useEffect(() => {
      children ? setInputValue(children) : setIsEditingMode(true);
    }, [children]);

    return (
      <Card className={classes.wrapper} ref={ref} {...rest}>
        <div className={classes.removeTaskBtnWrapper}>
          <IconButton
            size="small"
            className={classes.removeTaskBtn}
            onClick={removeTask}
          >
            <Close />
          </IconButton>
        </div>
        {isEditingMode ? (
          <TextField
            autoFocus
            fullWidth
            multiline
            value={inputValue}
            onChange={onDescriptionChange}
            onBlur={onDescriptionBlur}
          />
        ) : (
          <Typography variant="body1" onClick={onDescriptionClick}>
            {inputValue}
          </Typography>
        )}
      </Card>
    );
  }
);
