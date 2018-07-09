import { EventEmitter, Output, Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Row } from './th-sort';

@Component({
  selector: 'tr-sort',
  template:`
  
      <th *ngFor="let row of rows" (click)="sortList(row.column)" [ngClass]="{ 'asc': sortingDesc, 'desc': !sortingDesc }">
        <div>
          <label>{{row.title}}</label>
        </div>
      </th>
    <ng-content></ng-content>
  `
})
export class TableSorted {

  @ContentChildren(Row) rows: QueryList<Row>;
  @Output() OnTabSelected = new EventEmitter<Row>();

  public sortingDesc: boolean = false;
  SortList(list: any[], property: string) {
      this.sortingDesc = !this.sortingDesc;
      let direction = this.sortingDesc ? 1 : -1;
      let temp = property.split('.');
      let first = temp[0];
      let second = temp.length > 1 ? temp[1] : '';
      list = list.sort((a, b) => {
          if (this.GetProperty(a, first, second) < this.GetProperty(b, first, second)) {
              return -1 * direction;
          } else if (this.GetProperty(a, first, second) > this.GetProperty(b, first, second)) {
              return 1 * direction;
          }
          return 0;
      });
  }

  GetProperty(value: any, first: string, second: string): string {
      if (second != '') {
          return value[first][second];
      }
      return value[first];
  }
}
