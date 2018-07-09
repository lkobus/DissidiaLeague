import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmacaoComponent } from './modal-confirmacao.component';

import { ModalModule } from 'ngx-modal';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [
    ModalConfirmacaoComponent
  ],
  exports: [
    ModalConfirmacaoComponent
  ]
})
export class ModalConfirmacaoModule { }