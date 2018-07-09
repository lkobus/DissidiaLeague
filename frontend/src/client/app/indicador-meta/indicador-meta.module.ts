import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { IndicadoresMetaComponent } from './indicador-meta.component';
import { IndicadoresDetailComponent } from './indicador-meta-detail.component';
import { IndicadorMetaService } from './shared/indicador-meta.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { IndicadorMetaRoutingModule } from '../indicador-meta/indicador-meta-routing.module';
import { MyDatePickerModule } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

@NgModule({
  imports: [
    CommonModule,
    NguiAutoCompleteModule,
    MyDatePickerModule,
    MatDatepickerModule,
    IndicadorMetaRoutingModule,
    NgxPaginationModule,
    FormsModule, 
    SharedMaskModule,
    ModalModule,
    SharedModule
  ],
  declarations: [IndicadoresMetaComponent, IndicadoresDetailComponent],
  exports: [IndicadoresMetaComponent, IndicadoresDetailComponent],
  providers: [IndicadorMetaService]
})
export class IndicadorMetaModule { }
