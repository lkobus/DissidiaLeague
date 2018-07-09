import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaNotaComponent } from './entrada-nota.component';
import { EntradaNotaRoutingModule } from './entrada-nota-routing.module';
import { EstoqueService } from './../estoque/services/estoque.service';
import { NotaFiscalService } from './services/nota-fiscal.service';
import { ImageUploadModule } from './../angular2-image-upload/index';
import { ProdutosService } from './../produtos/shared/produtos.service';
import { FormsModule } from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ModalModule } from 'ngx-modal';
import { SharedModule } from '../shared/shared.module';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { MyDatePickerModule } from 'mydatepicker';
import { MatDatepickerModule } from '@angular/material';

@NgModule({
  imports: [
    MyDatePickerModule,
    MatDatepickerModule,
    CommonModule,
    FormsModule,
    NguiAutoCompleteModule,
    EntradaNotaRoutingModule,
    ModalModule,
    SharedModule,
    SharedMaskModule,
    ImageUploadModule.forRoot()
  ],
  declarations: [EntradaNotaComponent],
  exports: [EntradaNotaComponent],
  providers: [EstoqueService, ProdutosService, NotaFiscalService]
})
export class EntradaNotaModule { }
