import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaExternaComponent } from './venda-externa.component';
import { VendaExternaRoutingModule } from './venda-externa-routing.module';
import { VendaBalcaoAberturaModule } from '../caixa/caixa.module';

@NgModule({
  imports: [
    CommonModule, 
    VendaExternaRoutingModule,
    VendaBalcaoAberturaModule
  ],
  declarations: [
    VendaExternaComponent
  ],
  exports: [
    VendaExternaComponent
  ]
})
export class VendaExternaModule { }
