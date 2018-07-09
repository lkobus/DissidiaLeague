import { Component, Input, Output, EventEmitter, Renderer } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'csv-downloader',
  template: '<button class="btn-action"' +
            '[disabled]="isProcessing"' +
            '(click)="build()">' +
            '<span>{{downloaderName}}</span></button>'
})

export class CsvDownloaderComponent {
  @Input() downloaderName: string = 'Download CSV';
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() fileName: string = 'data.csv';
  @Input() keysToExport: string[] = [];
  @Output() onError = new EventEmitter<Error>();
  isProcessing: boolean = false;

  constructor(private renderer: Renderer) {
  }

  isProcessed(){
    this.isProcessing = true;
  }

  isProcess() {
    return this.isProcessing;
  }

  build() {
    if (!this.data.length) {
      this.onError.emit(new Error('Data not available.'));
      return;
    }
    this.isProcessing = true;

    let csvString = this.construct();
    this.buildDownloader(csvString);
  }

  private getDocumentBody(): any {
    return document.body;
  }

  private construct(): string {
    let tabText = '';
    var keys = Object.keys(this.data[0]);
    if (this.keysToExport.length) {
      keys = this.keysToExport;
    }
    if (!this.headers.length) {
      // if no headers are passed, use data keys for headers
      this.headers = keys;
    }

    this.headers.forEach(h => {
      tabText += '"' + h + '";';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.data.forEach(d => {
      keys.forEach(k => {
        if (d.hasOwnProperty(k) && d[k] !== null) {
          tabText += '"' + d[k] + '";';
        } else {
          //if (!this.keysToExport.length) {
            tabText += '"";';
         // }
        }
      });

      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    });

    return tabText;
  }

  private buildDownloader(data) {
    let anchor = this.renderer.createElement(this.getDocumentBody(), 'a');
    this.renderer.setElementStyle(anchor, 'visibility', 'hidden');
    this.renderer.setElementAttribute(anchor, 'href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    this.renderer.setElementAttribute(anchor, 'target', '_blank');
    this.renderer.setElementAttribute(anchor, 'download', this.fileName);

    setTimeout(() => {
      this.renderer.invokeElementMethod(anchor, 'click');
      this.renderer.invokeElementMethod(anchor, 'remove');
    }, 5);

    this.isProcessing = false;

  }
}
