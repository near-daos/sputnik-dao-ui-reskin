export const findSubstringIgnoreCase = (
  s1: string,
  s2: string,
): { index: number; match: string } => {
  const index = s1.toUpperCase().indexOf(s2.toUpperCase());

  if (index < 0) {
    return {
      index: -1,
      match: '',
    };
  }

  return {
    index,
    match: s1.slice(index, index + s2.length),
  };
};

export const highlightSubstring = (
  s1: string,
  searchTerm: string,
): { found: boolean; result: string } => {
  const { index: matchIndex, match } = findSubstringIgnoreCase(s1, searchTerm);

  if (matchIndex > -1) {
    const weightedText = `${s1.slice(
      0,
      matchIndex,
    )}<bold>${match}</bold>${s1.slice(matchIndex + match.length)}`;

    return {
      found: true,
      result: weightedText,
    };
  }

  return {
    found: false,
    result: s1,
  };
};
