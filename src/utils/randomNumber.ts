export const getRandomInt = (min: number, max: number): number => {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);

  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
};

export const getRandomNum = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
