import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAdminVisibleDirective]'
})
export class AdminVisibleDirective {

  constructor(private ref: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    // searches <game-item> element for the first button with the class 'Edit', used inside the admin dashboard
    const EditButton = this.ref.nativeElement.querySelector('.Edit') as HTMLInputElement;
    // hides the edit button, using angular's renderer2
    this.renderer.selectRootElement(EditButton).style.display = 'none';
  }

}