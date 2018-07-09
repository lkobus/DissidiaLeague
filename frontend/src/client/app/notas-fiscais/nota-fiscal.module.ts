import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileSaverModule } from 'ngx-filesaver';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { NotaFiscalComponent } from './nota-fiscal.component';
import { NotaFiscalDetailComponent } from './nota-fiscal-detail.component';
import { SharedModule } from '../shared/shared.module';
import { NotaFiscalRoutingModule } from './nota-fiscal-routing.module';
import { NotaFiscalService } from './services/nota-fiscal.service';
import { MyDatePickerModule } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';
import { ModalModule } from 'ngx-modal';

@NgModule({
  imports: [
    CommonModule,
    NotaFiscalRoutingModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    FileSaverModule,
    CurrencyMaskModule,
    MatDatepickerModule,
    MyDatePickerModule,
    SharedMaskModule,
    ModalModule
  ],
  declarations: [NotaFiscalComponent, NotaFiscalDetailComponent],
  exports: [NotaFiscalComponent, NotaFiscalDetailComponent],
  providers: [NotaFiscalService]
})
export class NotaFiscalModule { }
