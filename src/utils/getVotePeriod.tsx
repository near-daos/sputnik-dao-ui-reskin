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

export const timestampToReadable = (timestamp: number): string => {
  const seconds = Number(timestamp / 1e9);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';

  return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, '');
};
