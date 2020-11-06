import React, {
  ForwardRefExoticComponent,
  forwardRef,
  RefAttributes,
  useState,
  ChangeEvent,
  ReactElement,
  useEffect,
} from "react";
import { nanoid } from "nanoid";
import { useSetRecoilState } from "recoil";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { columnsState } from "../../../../store/entities";
import { Column as ColumnType } from "../../../../core/entities/Column";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: 300,
    height: "fit-content",
    padding: theme.spacing(0.5),
    margin: `${theme.spacing(1.5)}px ${theme.spacing(0.5)}px`,
    backgroundColor: theme.palette.background.paper,
  },
  addCardBtnWrapper: {
    marginLeft: "auto",
  },
}));

type ColumnProps = RefAttributes<HTMLDivElement> & {
  columnId: ColumnType["id"];
  children: ReactElement;
  title?: ColumnType["title"];
};

export const Column: ForwardRefExoticComponent<ColumnProps> = forwardRef(
  ({ title, columnId, children, ...rest }, ref) => {
    const classes = useStyles();
    const setColumns = useSetRecoilState(columnsState);
    const [inputValue, setInputValue] = useState("");
    const [isEditingMode, setIsEditingMode] = useState(false);

    const onTitleClick = () => setIsEditingMode(true);

    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setInputValue(value);
    };

    const onTitleBlur = () => {
      const newTitle = inputValue || title;

      if (!newTitle) {
        return;
      }

      setInputValue(newTitle);
      setIsEditingMode(false);
      setColumns((columns) =>
        columns.map((column) =>
          column.id === columnId ? { ...column, title: newTitle } : column
        )
      );
    };

    const onAddTask = () => {
      setColumns((columns) =>
        columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: [...column.tasks, { id: nanoid(), description: "" }],
            };
          }

          return { ...column };
        })
      );
    };

    useEffect(() => {
      title ? setInputValue(title) : setIsEditingMode(true);
    }, [title]);

    return (
      <Paper ref={ref} className={classes.wrapper} {...rest}>
        <div>
          {isEditingMode ? (
            <Input
              autoFocus
              value={inputValue}
              onChange={onTitleChange}
              onBlur={onTitleBlur}
            />
          ) : (
            <Typography onClick={onTitleClick} variant="h5">
              {inputValue}
            </Typography>
          )}
          {children}
        </div>
        <div className={classes.addCardBtnWrapper}>
          <Button size="small" variant="outlined" onClick={onAddTask}>
            add task
          </Button>
        </div>
      </Paper>
    );
  }
);
