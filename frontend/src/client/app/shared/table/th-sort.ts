import { Component, Input } from '@angular/core';

@Component({
  selector: 'th-sort',
  template: `
   
  `
})
export class Row {
  @Input('title') title: string;
  @Input('sort-column') column: string;

}
