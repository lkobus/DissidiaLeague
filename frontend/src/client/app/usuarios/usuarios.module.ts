import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosService } from './shared/usuarios.service';
import { UsuarioDetailComponent } from './usuario-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';

@NgModule({
  imports: [CommonModule,
    UsuariosRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedMaskModule,
    NguiAutoCompleteModule,
    NgxPaginationModule,
    ModalConfirmacaoModule
  ],
  declarations: [UsuariosComponent, UsuarioDetailComponent],
  exports: [UsuariosComponent, UsuarioDetailComponent],
  providers: [UsuariosService]
})
export class UsuariosModule { }
