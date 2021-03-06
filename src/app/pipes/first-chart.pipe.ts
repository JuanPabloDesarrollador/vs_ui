import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name:"firstChart"
})
export class FistChartPipe implements PipeTransform {
  transform(value: string) : string {
    return value && value.charAt(0)
  }
}
