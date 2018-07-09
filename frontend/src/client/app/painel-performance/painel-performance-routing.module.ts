import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PainelPerformanceComponent } from './painel-performance.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'painel-performance', component: PainelPerformanceComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PainelPerformanceRoutingModule { }
