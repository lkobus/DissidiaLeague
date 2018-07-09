import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './cadastro.component';
import { CadastroRoutingModule } from './cadastro-routing.module';

@NgModule({
  imports: [CommonModule, CadastroRoutingModule],
  declarations: [CadastroComponent],
  exports: [CadastroComponent]
})
export class CadastroModule { }
