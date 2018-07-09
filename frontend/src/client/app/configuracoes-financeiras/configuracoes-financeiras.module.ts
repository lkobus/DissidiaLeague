import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { ConfiguracoesFinanceirasComponent } from './configuracoes-financeiras.component'; 
import { ConfiguracoesFinanceirasService } from './shared/configuracoes-financeiras.service';
import { BancoService } from './shared/banco.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    SharedModule,
    SharedMaskModule
  ],
  declarations: [ConfiguracoesFinanceirasComponent],
  exports: [ConfiguracoesFinanceirasComponent],
  providers: [ConfiguracoesFinanceirasService, BancoService]
})
export class ConfiguracoesFinanceirasModule { }
