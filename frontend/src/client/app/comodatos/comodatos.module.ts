import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ComodatosComponent } from './comodatos.component';
import { ComodatosRoutingModule } from './comodatos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-modal';
import { ImageUploadModule } from './../angular2-image-upload/index.js';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { FileSaverModule } from 'ngx-filesaver';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { NguiMapModule } from '@ngui/map';
import { MyDatePickerModule } from 'mydatepicker';
import { UiSwitchModule } from '../_directives/switch/ui-switch.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ComodatoService } from './services/comodato.service';
import { ClienteService } from '../_services/cliente.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    NguiAutoCompleteModule,
    SharedModule,
    BrowserModule,
    HttpModule,
    ComodatosRoutingModule,
    NgxPaginationModule,
    MatButtonModule,
    MatCheckboxModule,
    NguiAutoCompleteModule,
    FileSaverModule,
    ImageUploadModule.forRoot(),
    SharedMaskModule,
    ModalModule,
    NguiMapModule,
    UiSwitchModule,
    MyDatePickerModule
  ],
  declarations: [ComodatosComponent],
  exports: [ComodatosComponent],
  providers: [ ClienteService, ComodatoService ]
})
export class ComodatosModule { }
