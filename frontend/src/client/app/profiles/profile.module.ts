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

@NgModule({
  imports: [CommonModule,
    ProfileRoutingModule,
    BrowserModule,
    ModalModule,      
    ImageUploadModule.forRoot(),
    SharedModule,
    FormsModule,
    HttpModule,
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
