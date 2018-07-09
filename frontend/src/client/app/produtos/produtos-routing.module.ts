import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProdutosComponent } from './produtos.component';
import { ProdutoDetailComponent } from './produto-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'produtos', component: ProdutosComponent },
      { path: 'addProduto', component: ProdutoDetailComponent },
      { path: 'updateProduto/:id', component: ProdutoDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
