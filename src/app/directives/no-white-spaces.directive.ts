import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoWhiteSpaces]'
})
export class NoWhiteSpacesDirective {

  public element: HTMLInputElement;
  constructor(private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement
  }

  @HostListener('input', ['$event'])
  onKeyUp(e: InputEvent) {
    if (e.data === ' ') {
      this.element.value = this.element.value.trim() + '-';
      return false
    } else {
      return e.data
    }
  }
}
