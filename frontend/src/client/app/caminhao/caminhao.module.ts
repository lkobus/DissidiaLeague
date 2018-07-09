import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { UiSwitchModule } from '../_directives/switch/ui-switch.module';

import { CaminhaoComponent } from '../caminhao/caminhao.component';
import { CaminhaoRoutingModule } from './caminhao-routing.module';
import { CaminhaoDetailComponent } from './caminhao-detail.component';
import { SharedModule } from '../shared/shared.module';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { CaminhaoService } from './shared/caminhao.service';
import { ModalConfirmacaoModule } from '../_directives/modal-confirmacao/modal-confirmacao.module';

@NgModule({
    imports: [CommonModule,
        CaminhaoRoutingModule,
        BrowserModule,
        FormsModule,
        SharedMaskModule,
        UiSwitchModule,
        HttpModule,
        NgxPaginationModule,
        SharedModule,
        ModalConfirmacaoModule
    ],
    declarations: [
        CaminhaoComponent,
        CaminhaoDetailComponent
    ],
    exports: [
        CaminhaoComponent,
        CaminhaoDetailComponent
    ],
    providers: [CaminhaoService]

})
export class CaminhaoModule { }
