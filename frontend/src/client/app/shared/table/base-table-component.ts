import { EventEmitter, Output, Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';

export class BaseTableComponent {

    public sortingDesc: boolean[] = [];
    public selectTableRow: string = '';

    constructor() {

    }

    SortList(list: any[], property: string) {
        this.selectTableRow = property;
        this.sortingDesc[property] = !this.sortingDesc[property];
        let direction = this.sortingDesc[property] ? 1 : -1;
        let temp = property.split('.');
        let first = temp[0];
        let second = temp.length > 1 ? temp[1] : '';
        if (list) {
            list = list.sort((a, b) => {
                if (this.GetProperty(a, first, second) < this.GetProperty(b, first, second)) {
                    return -1 * direction;
                } else if (this.GetProperty(a, first, second) > this.GetProperty(b, first, second)) {
                    return 1 * direction;
                }
                return 0;
            });
        }
    }

    GetProperty(value: any, first: string, second: string): string {
        if (second != '') {
            return value[first][second];
        }
        return value[first];
    }
}
