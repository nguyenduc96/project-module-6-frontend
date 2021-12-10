import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBoardFillter'
})
export class SearchBoardFillterPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item.title.toLowerCase().indexOf(filter) !== -1);
  }

}
