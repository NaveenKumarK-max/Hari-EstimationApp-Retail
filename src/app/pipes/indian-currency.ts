import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: any, decimals: number = 2): string {
    if (value == null || value === '') return '';

    const num = Number(value);
    if (isNaN(num)) return '';

    return num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
}