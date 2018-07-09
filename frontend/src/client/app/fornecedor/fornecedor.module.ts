import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { FornecedorComponent } from './fornecedor.component';
import { FornecedorService } from './service/fornecedor.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule, 
    SharedMaskModule,
    ModalModule,
    SharedModule
  ],
  declarations: [FornecedorComponent],
  exports: [FornecedorComponent],
  providers: [FornecedorService]
})
export class FornecedorModule { }
