import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RetornoComponent } from './retorno.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'retorno', component: RetornoComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RetornoRoutingModule { }
