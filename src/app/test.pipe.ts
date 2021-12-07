import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertFilter'
})
export class TestPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.indexOf(filter) !== -1);
  }
}
