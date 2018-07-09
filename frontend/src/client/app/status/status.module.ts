import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule }    from '@angular/http';

import { StatusComponent } from './status.component';
import { StatusRoutingModule } from './status-routing.module';
import { StatusService } from './shared/status.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,HttpModule,
        StatusRoutingModule
    ],
    declarations: [StatusComponent],
    exports: [StatusComponent],
    providers: [StatusService]
})
export class StatusModule { }
