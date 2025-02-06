import { ObjectUtils } from './object.utils';

export class ArrayUtils {

  static sort(arr: any[], fieldToSort: string, direction: SortDirection = SortDirection.ASC): any[] {
    return ObjectUtils.copy(arr).sort((a, b) => {

      let result = 0;

      let valueA = a[fieldToSort];
      let valueB = b[fieldToSort];

      let typeofField = typeof (valueA || valueB);

      if ((!valueA) && (!valueB)) {
        result = 0;
      } else if (!valueA) {
        result = direction === SortDirection.ASC ? 1 : -1;
      } else if (!valueB) {
        result = direction === SortDirection.ASC ? -1 : 1;
      } else {
        if (typeofField === 'number') {
          result = valueA - valueB;
        } else {
          result = (valueA?.toString() || '').localeCompare((valueB?.toString() || ''));
        }
      }

      if (direction === SortDirection.DESC) {
        result *= -1;
      }

      return result;
    });
  }

}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}
