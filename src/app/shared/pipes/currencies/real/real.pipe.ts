import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'real'
})
export class RealPipe implements PipeTransform {

  transform(value: number) {
    const currencyFormat = 'pt-BR';
    const currencyStyle = 'BRL';

    if (isNaN(value) || value === null) {
      return '';
    }

    return value.toLocaleString(currencyFormat, {style: 'currency', currency: currencyStyle});
  }

}
