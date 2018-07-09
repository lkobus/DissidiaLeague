import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarLeftComponent } from './navbar-left/navbar-left.component';
import { DynamicFormComponent } from './dynamic-question/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-question/dynamic-form-question.component';

import { MatButtonModule, MatCheckboxModule, MatRadioModule } from '@angular/material';

import { Row } from './table/th-sort';
import { TableSorted } from './table/table-sort';
import { Tabs } from './tabs/tabs';
import { Tab } from './tabs/tab';
import { CaixaService } from '../_services/caixa.service';
import { EmpresaService } from '../_services/empresa.service';
import { NotificacaoService } from '../notificacao/shared/notificacao.service';
import { ToastService } from '../_services/toast.service';
import { AlertComponent } from '../_directives/alert.component';

import { CurrencyFormat } from '../_pipe/currency-pipe';
import { AutofocusDirective } from '../_directives/auto-focus';

import { CsvDownloaderComponent } from './csv-downloader.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { AccordionComponent } from './accordion/accordion.component';
import { AccordionGroupComponent } from './accordion/accordion-group.component';
import { ExportModalComponent } from '../_directives/export-modal/export-modal.component';

import { ModalModule } from 'ngx-modal';
import { MyDatePickerModule } from 'mydatepicker';
import { ImageUploadModule } from '../angular2-image-upload/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalModule,
    ImageUploadModule.forRoot(),
    MyDatePickerModule,
    MatButtonModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Aguarde...',
        backdrop: true,
        template:
          '<div class="loading-overlay">' +
          '<img src="assets/logo-promax-blue.png" alt="logo Promax" width="123" height="15" class="img-loader" />' +
          '<div class="spinner">' +
          '<div class="bounce1"></div>' +
          '<div class="bounce2"></div>' +
          '<div class="bounce3"></div>' +
          '</div>' +
          '<h1 class="loading-venda">' +
          '{{message}}' +
          '</h1>' +
          '</div>',
        delay: 0,
        minDuration: 1000,
        wrapperClass: 'ng-busy'
      })
    ),
    MatCheckboxModule,
    MatRadioModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    AlertComponent,
    ExportModalComponent,
    ToolbarComponent,
    NavbarComponent,
    NavbarLeftComponent,
    Tabs,
    Tab,
    TableSorted,
    Row,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    CurrencyFormat,
    CsvDownloaderComponent,
    AutofocusDirective,
    AccordionComponent,
    AccordionGroupComponent
  ],
  exports: [
    AlertComponent,
    ExportModalComponent,
    ToolbarComponent,
    NavbarComponent,
    NavbarLeftComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    Tabs,
    Tab,
    TableSorted,
    Row,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    CurrencyFormat,
    CsvDownloaderComponent,
    AutofocusDirective,
    SimpleNotificationsModule,
    AccordionComponent,
    AccordionGroupComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CaixaService, NotificacaoService, EmpresaService, ToastService]
    };
  }
}
