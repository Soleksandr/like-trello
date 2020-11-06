import React from "react";
import { useSetRecoilState } from "recoil";
import Button from "@material-ui/core/Button";

import { columnsState } from "../../../../store/entities";

export const ClearBoardBtn = () => {
  const setColumns = useSetRecoilState(columnsState);

  const onClick = () => {
    setColumns(() => []);
  };
  return (
    <Button color="secondary" onClick={onClick} variant="outlined">
      clear board
    </Button>
  );
};
