import { atom } from "recoil";

import { Task } from "../core/entities/Task";
import { TASK_DETAILS_STATE } from "./constants";

export type TaskDetails = Task & {
  columnId: string;
};

export const taskDetailsState = atom<TaskDetails | null>({
  key: TASK_DETAILS_STATE,
  default: null,
});
