import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EstoqueComponent } from './estoque.component';
import { EstoqueTransferenciaComponent } from './estoque-transferencia.component';
import { EstoqueAtivosGiroComponent } from './estoque-ativos-giro.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'estoque', component: EstoqueComponent },
      { path: 'estoque-transferencia', component: EstoqueTransferenciaComponent },
      { path: 'estoque-ativos-giro', component: EstoqueAtivosGiroComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EstoqueRoutingModule { }
