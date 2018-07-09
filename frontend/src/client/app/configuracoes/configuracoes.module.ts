import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UiSwitchModule } from '../_directives/switch/ui-switch.module';
import { SharedModule } from '../shared/shared.module';
import { ImageUploadModule } from './../angular2-image-upload/index';

import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';
import { ConfiguracoesComponent } from './configuracoes.component';
import { ConfiguracoesFinanceirasModule } from '../configuracoes-financeiras/configuracoes-financeiras.module';
import { ConfiguracoesService } from './shared/configuracoes.service';
import { MatCheckboxModule, MatRadioModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    MatCheckboxModule,
    MatRadioModule,
    ConfiguracoesFinanceirasModule,
    UiSwitchModule,
    CommonModule,
    ImageUploadModule.forRoot(),
    ConfiguracoesRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxPaginationModule
  ],
  declarations: [ConfiguracoesComponent],
  exports: [ConfiguracoesComponent],
  providers: [ConfiguracoesService]

})
export class ConfiguracoesModule { }
