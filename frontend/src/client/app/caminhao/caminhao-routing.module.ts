import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CaminhaoComponent } from './caminhao.component';
import { CaminhaoDetailComponent } from './caminhao-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'caminhao', component: CaminhaoComponent },
      { path: 'addCaminhao', component: CaminhaoDetailComponent },
      { path: 'updateCaminhao/:id', component: CaminhaoDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CaminhaoRoutingModule { }