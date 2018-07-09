import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendaBalcaoComponent } from './venda-balcao.component';
import { VendaBalcaoRetirarDinheiroComponent } from './venda-balcao-retirar-dinheiro.component';
import { VendaBalcaoProdutosComponent } from './venda-balcao-produtos.component';
import { VendaBalcaoSuprimentoComponent } from './venda-balcao-suprimento.component';
import { VendaBalcaoTrocaOperadorComponent } from './venda-balcao-troca-operador.component';
import { VendaBalcaoHistoricoComponent } from './venda-balcao-historico.component';
import { VendaBalcaoCancelarComponent } from './venda-balcao-cancelar.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'venda-balcao', component: VendaBalcaoComponent },
      { path: 'venda-balcao-retirar-dinheiro', component: VendaBalcaoRetirarDinheiroComponent },
      { path: 'venda-balcao-suprimento', component: VendaBalcaoSuprimentoComponent },
      { path: 'venda-balcao-produtos', component: VendaBalcaoProdutosComponent },
      { path: 'venda-balcao-troca-operador', component: VendaBalcaoTrocaOperadorComponent },
      { path: 'venda-balcao-historico', component: VendaBalcaoHistoricoComponent },
      { path: 'venda-balcao-cancelar/:id', component: VendaBalcaoCancelarComponent }
    ])
  ],
  exports: [RouterModule]
})
export class VendaBalcaoRoutingModule { }
