import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComodatosComponent } from './comodatos.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'comodatos', component: ComodatosComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ComodatosRoutingModule { }
