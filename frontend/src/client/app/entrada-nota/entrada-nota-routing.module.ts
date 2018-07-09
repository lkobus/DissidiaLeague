import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntradaNotaComponent } from './entrada-nota.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'entrada-nota', component: EntradaNotaComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EntradaNotaRoutingModule { }
