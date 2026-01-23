import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TruncatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limitTo',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: string) : string {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    let limit = args ? parseInt(args, 10) : 10;
    let trail = '...';
    console.log('pipe')
    console.log(value.length > limit ? value.substring(0, limit) + trail : value)

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
