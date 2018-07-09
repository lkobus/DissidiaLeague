import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManuntencaoFrequenciaComponent } from './manuntencao-frequencia.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'manuntencao', component: ManuntencaoFrequenciaComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ManuntencaoFrequenciaRoutingModule { }
