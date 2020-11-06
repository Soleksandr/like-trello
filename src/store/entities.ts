import { atom } from "recoil";
import store from "store";
import { nanoid } from "nanoid";

import { Column } from "../core/entities/Column";
import { Task } from "../core/entities/Task";
import { COLUMN_STATE } from "./constants";

export interface IColumn extends Column {
  tasks: Task[];
}

export const columnsState = atom<IColumn[]>({
  key: COLUMN_STATE,
  default: [],
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      setSelf(store.get(COLUMN_STATE) || getMockDefaultState());

      onSet((columns) => {
        store.set(COLUMN_STATE, columns);
      });
    },
  ],
});

export function getMockDefaultState(): IColumn[] {
  const mockTasks: Task[] = [
    {
      id: nanoid(),
      description: "Review this application and send me feedback please",
    },
  ];

  return [
    {
      id: nanoid(),
      title: "To Do",
      tasks: mockTasks,
    },
    {
      id: nanoid(),
      title: "In Progress",
      tasks: [],
    },
    {
      id: nanoid(),
      title: "Done",
      tasks: [],
    },
  ];
}
