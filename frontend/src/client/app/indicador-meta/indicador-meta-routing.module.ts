import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IndicadoresMetaComponent } from './indicador-meta.component';
import { IndicadoresDetailComponent } from './indicador-meta-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([ 
      { path: 'indicador-meta', component: IndicadoresMetaComponent },
      { path: 'verIndicador/:id', component: IndicadoresDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class IndicadorMetaRoutingModule { }