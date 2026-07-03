import { Pipe, PipeTransform } from '@angular/core';
import { Game } from '../Models/game';

@Pipe({
  name: 'filterPipe',
  standalone: true
})
export class FilterPipePipe implements PipeTransform {

  transform(value: Game[], searchTerm: string): Game[] {
    if (!value) return [];
    if (!searchTerm) return value;
    const lowerSearch = searchTerm.toLowerCase();
    // filter games whose name includes search term
    const filtered = value.filter(game => game.Name.toLowerCase().includes(lowerSearch));
    return filtered;
  }
}
