import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VisaoGeralComponent } from './visao-geral.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'visao-geral', component: VisaoGeralComponent }
    ])
  ],
  exports: [RouterModule]
})
export class VisaoGeralRoutingModule { }
