import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotaFiscalComponent } from './nota-fiscal.component';
import { NotaFiscalDetailComponent } from './nota-fiscal-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'notas-fiscais', component: NotaFiscalComponent },
      { path: 'notas-fiscais/:id', component: NotaFiscalDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class NotaFiscalRoutingModule { }
