import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
  standalone: true
})
export class UniquePipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!array) return [];
    return [...new Set(array.map(item => item[field]))];
  }
} 