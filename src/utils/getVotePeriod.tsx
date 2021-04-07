export type Period = {
  months: number;
  days: number;
  hours: number;
};

function getVotePeriod(date: Date): Period {
  const now = Date.now();
  const lastDate = new Date(date).getTime();
  const duration = lastDate - now;
  const totalHours = Math.floor(duration / (1000 * 60 * 60));
  const totalDays = Math.floor(totalHours / 24);
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  const hours = totalHours % (24 * totalDays);

  return {
    months,
    days,
    hours,
  };
}

export default getVotePeriod;
