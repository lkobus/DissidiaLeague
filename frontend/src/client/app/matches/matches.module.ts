import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';
import { MatchesService } from './shared/matches.service';
import { MatchesComponent } from './matches.component';
import { MatchesDetailComponent } from './detail/matches-detail.component';
import { MatchesRoutingModule } from './matches-routing.module';
import { MatDatepickerModule, MatRadioModule } from '@angular/material';
import { BusyModule, BusyConfig } from 'angular2-busy';

@NgModule({
  imports: [CommonModule,
    MatchesRoutingModule,
    BrowserModule,
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
    MatDatepickerModule,
    MatRadioModule,
    FormsModule,
    HttpModule,
    SharedMaskModule,
    NguiAutoCompleteModule,
    NgxPaginationModule,
    ModalConfirmacaoModule
  ],
  declarations: [MatchesComponent, MatchesDetailComponent],
  exports: [MatchesComponent, MatchesDetailComponent],
  providers: [MatchesService]
})
export class MatchesModule { }
