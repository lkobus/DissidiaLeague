import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendaExternaComponent } from './venda-externa.component';
import { VendaExternaFecharComponent } from '../caixa/fechamento/fechamento-caixa.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'venda-externa', component: VendaExternaComponent },
      { path: 'venda-externa-fechar', component: VendaExternaFecharComponent }
    ])
  ],
  exports: [RouterModule]
})
export class VendaExternaRoutingModule { }
