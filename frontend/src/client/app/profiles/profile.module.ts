import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './detail/profile-detail.component';
import { ProfileService } from './shared/profile.service';
import { ProfileRoutingModule } from './profile-routing.module';
import { Tab } from '../shared/tabs/tab';
import { Tabs } from '../shared/tabs/tabs';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-modal';
import { ImageUploadModule } from '../angular2-image-upload/index';
import { ChartsModule } from 'ng4-charts';
import { MatRadioModule, MatCheckboxModule } from '@angular/material';
import { MyDatePickerModule, MyDatePicker } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';
import { BusyConfig, BusyModule } from 'angular2-busy';
@NgModule({
  imports: [CommonModule,
    ProfileRoutingModule,
    BrowserModule,
    MatCheckboxModule,
    MyDatePickerModule,
    MatDatepickerModule,
    MatRadioModule,
    ModalModule,      
    ImageUploadModule.forRoot(),
    SharedModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Aguarde...',
        backdrop: true,
        template:
          '<div class="loading-overlay">' +
          '<img src="assets/loader.gif" alt="logo Promax" height="194" class="img-loader" />'+
          '<div class="spinner">'+
          '<div class="bounce1"></div>'+
          '<div class="bounce2"></div>'+
          '<div class="bounce3"></div>'+
          '</div>'+
          '<h1 class="loading-venda">' +
          '{{message}}' +
          '</h1>' +
          '</div>',
        delay: 0,
        minDuration: 1000,
        wrapperClass: 'ng-busy'
      })
),
    FormsModule,
    HttpModule,
    ChartsModule,    
    SharedMaskModule,
    NguiAutoCompleteModule,
    NgxPaginationModule,
    ModalConfirmacaoModule
  ],
  declarations: [ProfileComponent, ProfileDetailComponent],
  exports: [ProfileComponent, ProfileDetailComponent],
  providers: [ProfileService]
})
export class ProfileModule { }
