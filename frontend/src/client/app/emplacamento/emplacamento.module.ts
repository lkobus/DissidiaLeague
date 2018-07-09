import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmplacamentoComponent } from './emplacamento.component';
import { EmplacamentoRoutingModule } from './emplacamento-routing.module';

import { SharedModule } from '../shared/shared.module';
import { NguiMapModule } from '@ngui/map';

@NgModule({
  imports: [
    CommonModule,
    EmplacamentoRoutingModule,
    SharedModule,
    NguiMapModule
  ],
  declarations: [EmplacamentoComponent],
  exports: [EmplacamentoComponent]
})
export class EmplacamentoModule { }
