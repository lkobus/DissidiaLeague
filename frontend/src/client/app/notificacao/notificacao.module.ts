import { NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NotificacaoRoutingModule } from './notificacao-routing.module';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from './shared/notificacao.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        NotificacaoRoutingModule
    ],
    declarations: [NotificacaoComponent],
    exports: [NotificacaoComponent],
    providers: [NotificacaoService]
})
export class NotificacaoModule {

}
