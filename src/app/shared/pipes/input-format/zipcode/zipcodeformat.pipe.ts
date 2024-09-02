import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zipcodeformat'
})
export class ZipcodeformatPipe implements PipeTransform {

  transform(value: string): string {

    if (!value) {
      return '';
    }

    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length === 8) {
      return numericValue.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }

    return value;
  }

}
