import React from "react";
import { nanoid } from "nanoid";

import Button from "@material-ui/core/Button";
import { useSetRecoilState } from "recoil";

import { columnsState } from "../../../../store/entities";

export const AddColumnBtn = () => {
  const setColumns = useSetRecoilState(columnsState);

  const onClick = () => {
    setColumns((columns) => {
      return [
        ...columns,
        {
          id: nanoid(),
          title: "",
          tasks: [],
        },
      ];
    });
  };

  return (
    <Button onClick={onClick} variant="outlined" fullWidth>
      add column
    </Button>
  );
};
