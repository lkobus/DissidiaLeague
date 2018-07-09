import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PedidosComponent } from "./pedidos.component";
import { PedidoDetailComponent } from "./pedido-detail.component";
import { PedidoOutrasOperacoesComponent } from "./pedido-outras-operacoes.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "pedidos", component: PedidosComponent },
      { path: "addPedido", component: PedidoDetailComponent },
      {
        path: "addPedido/outrasOperacoes",
        component: PedidoOutrasOperacoesComponent
      },
      { path: "pedidoResumo/:id", component: PedidoDetailComponent },
      {
        path: "pedidoResumo/outrasOperacoes/:id",
        component: PedidoOutrasOperacoesComponent
      },
      { path: "pedidoResumo/:id/:sucess", component: PedidoDetailComponent },
      {
        path: "pedidoResumo/outrasOperacoes/:id/:sucess",
        component: PedidoOutrasOperacoesComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class PedidosRouting {}
