import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CadastroComponent } from './cadastro.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'cadastro', component: CadastroComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CadastroRoutingModule { }
