import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BaseRequestOptions } from '@angular/http';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { LoginRoutingModule }        from './login-routing.module';
import { AuthGuard } from '../_guards/index';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        LoginRoutingModule,
        BusyModule.forRoot(
            new BusyConfig({
              message: 'Aguarde...',
              backdrop: true,
              template:
                '<div class="loading-overlay">' +
                '<img src="assets/loader.gif" alt="logo Promax" height="194" class="img-loader" />'+
                '<div class="spinner">'+
                '<div class="bounce1"></div>'+
                '<div class="bounce2"></div>'+
                '<div class="bounce3"></div>'+
                '</div>'+
                '<h1 class="loading-venda">' +
                '{{message}}' +
                '</h1>' +
                '</div>',
              delay: 0,
              minDuration: 1000,
              wrapperClass: 'ng-busy'
            })
    )
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        AuthGuard,
        BaseRequestOptions
    ],
    exports: [LoginComponent],
    bootstrap: [LoginComponent]
})

export class LoginModule { }
