import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancasComponent } from './financas.component';
import { FinancasRoutingModule } from './financas-routing.module';
import { AngularEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-modal';
import { FinanceiroService } from './services/financas.service';
import { FornecedorModule } from '../fornecedor/fornecedor.module';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { MyDatePickerModule } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';
import { ImageUploadModule } from './../angular2-image-upload/index.js';

@NgModule({
  imports: [
    CommonModule,
    MyDatePickerModule,
    MatDatepickerModule,
    FinancasRoutingModule,
    AngularEchartsModule,
    SharedModule,
    SharedMaskModule,
    NgxPaginationModule,
    ModalModule,
    NguiAutoCompleteModule,
    FornecedorModule,
    ImageUploadModule.forRoot()
  ],
  declarations: [FinancasComponent],
  exports: [FinancasComponent],
  providers: [FinanceiroService]
})
export class FinancasModule { }
