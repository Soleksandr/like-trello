import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import { Board } from "./components/Board";
import { Toolbar } from "./components/Toolbar";
import { TaskDetails } from "./components/TaskDetails";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    flex: 0,
    marginBottom: theme.spacing(1),
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "auto",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth={false}>
      <header className={classes.header}>
        <Toolbar />
      </header>
      <main className={classes.main}>
        <Board />
      </main>
      <TaskDetails />
    </Container>
  );
}

export default App;
