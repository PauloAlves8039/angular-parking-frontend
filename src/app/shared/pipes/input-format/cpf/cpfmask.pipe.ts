import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfmask'
})
export class CpfmaskPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    const numericValue = value.replace(/\D/g, '');
    const numericFormat = numericValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

    return numericFormat;
  }
}
