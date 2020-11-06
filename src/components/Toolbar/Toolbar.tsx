import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import AppBar from "@material-ui/core/AppBar";
import ToolbarMat from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fade, makeStyles } from "@material-ui/core/styles";

import { selectAllTasks } from "../../store/selectors";
import { ClearBoardBtn } from "./components/ClearBoardBtn";
import { TaskDetails, taskDetailsState } from "../../store/ui";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    marginRight: theme.spacing(1.5),
  },
  inputRoot: {
    color: "inherit",
    width: 250,
  },
}));

export const Toolbar = () => {
  const classes = useStyles();
  const tasks = useRecoilValue(selectAllTasks);
  const [taskDetails, setTaskDetails] = useRecoilState(taskDetailsState);

  const onSearch = (_: any, task: TaskDetails | string | null) => {
    setTaskDetails(task as TaskDetails);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <ToolbarMat variant="dense">
          <Typography className={classes.title} variant="h6" noWrap>
            Like Trello ಠ‿↼
          </Typography>
          <div className={classes.search}>
            <Autocomplete
              freeSolo
              clearOnBlur
              size="small"
              onChange={onSearch}
              options={tasks}
              value={taskDetails?.description || ""}
              getOptionLabel={(option) => option.description || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="...Search"
                  classes={{
                    root: classes.inputRoot,
                  }}
                  InputProps={{ ...params.InputProps }}
                />
              )}
            />
          </div>
          <ClearBoardBtn />
        </ToolbarMat>
      </AppBar>
    </div>
  );
};
