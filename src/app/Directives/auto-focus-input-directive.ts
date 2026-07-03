import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocusInputDirective]'
})
export class AutoFocusInputDirective implements OnInit {

  constructor(private ref: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    // gets the element the directive is attached to
    const inputElement = this.ref.nativeElement as HTMLInputElement;
    // sets focus to the input element, using angular's renderer2
    this.renderer.selectRootElement(inputElement).focus();
  }

}
