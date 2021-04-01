function numberReduction(number: number): string {
  if (number < 1000) {
    return number.toString();
  }

  if (number < 1000000) {
    return `${Math.round(number / 1000)}K`;
  }

  return `${Math.round(number / 1000000)}M`;
}

export default numberReduction;
