import React, { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";

import { taskDetailsState } from "../../store/ui";
import { columnsState } from "../../store/entities";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: 450,
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

export const TaskDetails = () => {
  const classes = useStyles();
  const setColumns = useSetRecoilState(columnsState);
  const [taskDetails, setTaskDetails] = useRecoilState(taskDetailsState);

  const [inputValue, setInputValue] = useState("");

  const onClose = () => {
    setTaskDetails(null);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInputValue(value);
  };

  const onSave = () => {
    if (!inputValue || !taskDetails) {
      return;
    }

    setColumns((columns) =>
      columns.map((column) => {
        if (column.id === taskDetails.columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === taskDetails.id
                ? { ...task, description: inputValue }
                : { ...task }
            ),
          };
        }

        return { ...column };
      })
    );

    onClose();
  };

  const onRemove = () => {
    if (!taskDetails) {
      return;
    }

    setColumns((columns) =>
      columns.map((column) => {
        if (column.id === taskDetails.columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskDetails.id),
          };
        }

        return { ...column };
      })
    );

    onClose();
  };

  useEffect(() => {
    if (taskDetails) {
      setInputValue(taskDetails.description);
    }
  }, [taskDetails]);

  if (!taskDetails) {
    return null;
  }

  return (
    <Dialog onClose={onClose} open>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Card className={classes.wrapper}>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={inputValue}
            onChange={onEdit}
          />
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onRemove} color="secondary">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};
