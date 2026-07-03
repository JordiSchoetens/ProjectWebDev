import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starPipe',
  standalone: true
})
export class StarPipePipe implements PipeTransform {

  // must be rendered as innerHTML in component otherwise it would show plain HTML
  // when not innerHTML EG.: <span class="starfilled">★★★</span><span class="star">☆☆</span>

  transform(rating: number): string {
    const maxStars = 5;
    if (rating == null || rating < 0) {
      return '';
    }
    
    const emptyStars = maxStars - rating;

    // make string with rating amount filled stars, and rest empty stars
    const stars = '<span class="starfilled">' + '★'.repeat(rating) + '</span>' + '<span class="star">' + '☆'.repeat(emptyStars) + '</span>';
    
    return stars;
  }

}
