import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioDetailComponent } from './usuario-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'addUsuario', component: UsuarioDetailComponent },
      { path: 'updateUsuario/:id', component: UsuarioDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
