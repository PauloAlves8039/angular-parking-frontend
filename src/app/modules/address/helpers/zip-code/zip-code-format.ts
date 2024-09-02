export class ZipCodeFormat {
  constructor() {}

  zipCodeFormatHelper(zipCode: string): string {
    if (!zipCode) {
      return '';
    }

    const cleaned = zipCode.replace(/\D/g, '');
    return cleaned.length <= 5 ? cleaned : `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  }
}
