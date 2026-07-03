
import { AdminVisibleDirective } from './admin-visible-directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('AdminVisibleDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;
    const mockRenderer2 = {} as Renderer2;
    const directive = new AdminVisibleDirective(mockElementRef, mockRenderer2);
    expect(directive).toBeTruthy();
  });
});
