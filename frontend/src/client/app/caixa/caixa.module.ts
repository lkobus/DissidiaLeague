import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaBalcaoAberturaCaixaComponent } from './abertura-caixa.component';
import { VendaExternaFecharComponent } from './fechamento/fechamento-caixa.component';
import { ExtratoDiarioCaixaComponent } from './extrato-diario.component';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-modal';
@NgModule({
  imports: [
    ModalModule,
    CommonModule,
    SharedMaskModule,
    SharedModule
  ],
  declarations: [
    VendaExternaFecharComponent,
    VendaBalcaoAberturaCaixaComponent,
    ExtratoDiarioCaixaComponent
  ],
  exports: [
    VendaExternaFecharComponent,
    VendaBalcaoAberturaCaixaComponent,
    ExtratoDiarioCaixaComponent
  ],
  providers: []
})
export class VendaBalcaoAberturaModule { }