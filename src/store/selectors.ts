import { selector } from "recoil";

import { columnsState } from "./entities";
import { TaskDetails } from "./ui";

export const selectAllTasks = selector({
  key: "selectAllTasks",
  get: ({ get }) => {
    const columns = get(columnsState);

    return columns.reduce<TaskDetails[]>(
      (tasks, column) => [
        ...tasks,
        ...column.tasks.map((task) => ({ ...task, columnId: column.id })),
      ],
      []
    );
  },
});
