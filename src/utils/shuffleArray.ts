export const shuffleArray = (array: number[]): number[] => {
  let tmp;
  let current;
  let top = array.length;
  const shuffled = array;

  if (top) {
    // eslint-disable-next-line no-plusplus
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = shuffled[current];
      shuffled[current] = shuffled[top];
      shuffled[top] = tmp;
    }
  }

  shuffled.length = 10;

  return shuffled;
};
