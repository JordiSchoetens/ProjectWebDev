
import { AutoFocusInputDirective } from './auto-focus-input-directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('AutoFocusInputDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;
    const mockRenderer2 = {} as Renderer2;
    const directive = new AutoFocusInputDirective(mockElementRef, mockRenderer2);
    expect(directive).toBeTruthy();
  });
});
