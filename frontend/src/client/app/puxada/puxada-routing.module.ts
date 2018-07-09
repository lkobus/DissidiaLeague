import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PuxadaComponent } from './puxada.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'puxada', component: PuxadaComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ProdutosRoutingModule { }
