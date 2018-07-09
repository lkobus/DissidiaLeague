import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProdutosComponent } from './produtos.component';
import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutoDetailComponent }  from './produto-detail.component';
import { ProdutosService } from './shared/produtos.service';
import { ImageUploadModule } from './../angular2-image-upload/index';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-modal';

//import { MdButtonModule, MdCheckboxModule } from '@angular/material';

@NgModule({
  imports: [CommonModule,
            ProdutosRoutingModule,
            BrowserModule,
            FormsModule,
            HttpModule,
            SharedMaskModule,
            SharedModule,
            NgxPaginationModule,
            ImageUploadModule.forRoot(),
            MatButtonModule,
            ModalModule,
            MatCheckboxModule],
  declarations: [ProdutosComponent, ProdutoDetailComponent],
  exports: [ProdutosComponent, ProdutoDetailComponent],
  providers: [ProdutosService]

})
export class ProdutosModule { }
