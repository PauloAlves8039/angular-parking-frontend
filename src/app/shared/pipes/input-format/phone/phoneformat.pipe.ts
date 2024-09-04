import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneformat'
})
export class PhoneformatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    const numericValue = value.replace(/\D/g, '');
    const numericFormat = numericValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');

    return numericFormat;
  }
}
