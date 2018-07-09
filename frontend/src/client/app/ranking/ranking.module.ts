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

@NgModule({
  imports: [CommonModule,
    RankingRoutingModule,
    BrowserModule,
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
