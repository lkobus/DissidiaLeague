import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmplacamentoComponent } from './emplacamento.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'emplacamento', component: EmplacamentoComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EmplacamentoRoutingModule { }
