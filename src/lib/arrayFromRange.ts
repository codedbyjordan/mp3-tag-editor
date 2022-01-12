const arrayFromRange = (start: number = 1, end: number) => {
  return Array(end + 1 - start)
    .fill({}) // empty object so TS doesn't get annoyed 'expected 1-3 parameters' head ass
    .map((_, i) => start + i);
};

export default arrayFromRange;
