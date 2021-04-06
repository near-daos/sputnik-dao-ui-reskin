import moment from 'moment';

export type Period = {
  months: number;
  days: number;
  hours: number;
};

function getVotePeriod(date: Date): Period {
  const now = moment();
  const lastDate = moment(date);
  const duration = moment.duration(lastDate.diff(now));
  const totalHours = Math.floor(duration.asHours());
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
