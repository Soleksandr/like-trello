export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

export const moveBetween = (
  source: any[],
  destination: any[],
  droppableSource: any,
  droppableDestination: any
) => {
  const updatedSource = Array.from(source);
  const updatedDestination = Array.from(destination);
  const [removed] = updatedSource.splice(droppableSource.index, 1);

  updatedDestination.splice(droppableDestination.index, 0, removed);

  return {
    updatedSource,
    updatedDestination,
  };
};
