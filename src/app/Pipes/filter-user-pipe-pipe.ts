import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../Models/user-model';

@Pipe({
  name: 'filterUserPipe',
  standalone: true
})
export class FilterUserPipePipe implements PipeTransform {

  transform(value: UserModel[], searchTerm: string): UserModel[] {
    if (!value) return [];
    if (!searchTerm) return value;
    const lowerSearch = searchTerm.toLowerCase();
    // filters users whose email includes the search term
    const filtered = value.filter(user => user.Email.toLowerCase().includes(lowerSearch));
    return filtered;
  }

}