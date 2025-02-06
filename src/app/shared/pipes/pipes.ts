import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class filterPipe implements PipeTransform {
  transform(items: any[], hiddenfilter: (item: any, params: any) => boolean, params: any): any {
    if (!items || !hiddenfilter) {
        return items;
    }
    return items.filter(item => hiddenfilter(item, params));
}
}
