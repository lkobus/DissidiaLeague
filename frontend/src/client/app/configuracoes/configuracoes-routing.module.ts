import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfiguracoesComponent } from './configuracoes.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'configuracoes', component: ConfiguracoesComponent },
    ])
  ],
  exports: [RouterModule]
})
export class ConfiguracoesRoutingModule { }
