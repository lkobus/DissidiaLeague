import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequenciaVisitaComponent } from './frequencia-visita.component';
import { MatCheckboxModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    MatCheckboxModule, MatDatepickerModule, MatNativeDateModule,
    MyDatePickerModule
  ],
  declarations: [FrequenciaVisitaComponent],
  exports: [FrequenciaVisitaComponent]
})
export class FrequenciaVisitaModule { }
