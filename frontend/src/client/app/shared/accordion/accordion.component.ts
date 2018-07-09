import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tp-accordion',
  template: `
    <div class="accordion-head" [class.active]="active" (click)="onClick($event)">
      <h2 class="accordion-head-title">{{ title }}</h2>
      <i class="fa fa-chevron-down" aria-hidden="true"></i>
    </div>
    <div class="accordion-body" [class.active]="active">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
    .accordion-head {
      cursor: pointer;
    }
    .accordion-body {
      display: none;
    }
    .accordion-body.active {
      display: block;
      -webkit-animation: fadeIn .3s;
      animation: fadeIn .3s;
    }
    @-webkit-keyframes fadeIn {
      from { opacity: 0; transform: scale(0); }
        to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0); }
        to { opacity: 1; transform: scale(1); }
    }
    `
  ],
})
export class AccordionComponent {

  @Input() title: string;

  @Input() active: boolean = false;

  @Output() toggleAccordion: EventEmitter<boolean> = new EventEmitter();

  onClick(event) {
    event.preventDefault();
    this.toggleAccordion.emit(this.active);
  }

}
