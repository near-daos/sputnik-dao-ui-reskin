import { DaoItem } from '../types/dao';
import { nearConfig } from '../config';

export function filterDaoBySearchStr(
  searchStr: string,
  daoList: DaoItem[],
): DaoItem[] {
  let filterMethod;
  const { walletFormat } = nearConfig;

  if (walletFormat && searchStr.endsWith(walletFormat)) {
    filterMethod = (doa: DaoItem) =>
      doa.members.some((member) => member === searchStr);
  } else {
    filterMethod = (doa: DaoItem) =>
      doa.id.toUpperCase().indexOf(searchStr.toUpperCase()) !== -1;
  }

  const filtered = daoList.filter(filterMethod);

  return filtered;
}
