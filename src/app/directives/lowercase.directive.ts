import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLowercase]'
})
export class LowercaseDirective {

  private el: HTMLInputElement;
  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement
  }

  @HostListener('input', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    if (this.el && this.el.value) {
      this.el.value = this.el.value.toLowerCase();
    }
  }
}
