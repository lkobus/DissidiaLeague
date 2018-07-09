import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ClienteDetailComponent } from './cliente-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'clientes', component: ClientesComponent },
      { path: 'addCliente', component: ClienteDetailComponent },
      { path: 'updateCliente/:id', component: ClienteDetailComponent },
      { path: 'updateCliente/:id/:sucess', component: ClienteDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
