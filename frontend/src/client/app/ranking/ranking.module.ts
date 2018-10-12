import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';
import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './ranking.component';
import { RankingService } from './shared/ranking.service';
import { RankingDetailComponent } from './detail/ranking-detail.component';
import { BusyModule, BusyConfig } from 'angular2-busy';

@NgModule({
  imports: [CommonModule,
    RankingRoutingModule,
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
    FormsModule,
    HttpModule,
    SharedMaskModule,
    NguiAutoCompleteModule,
    NgxPaginationModule,
    ModalConfirmacaoModule
  ],
  declarations: [RankingComponent, RankingDetailComponent],
  exports: [RankingComponent, RankingDetailComponent],
  providers: [RankingService]
})
export class RankingModule { }
