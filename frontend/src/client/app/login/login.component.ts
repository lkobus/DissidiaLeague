import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { Modulo } from '../_model/modulo';
import { LoginResponse } from '../_model/login-response';
import * as url from 'url-search-params-polyfill';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {    
    model: any = {};
    loading = false;
    returnUrl: string;
    modulos: Modulo[];    
    busy: any;
    finishedSync: boolean;
    
    templateLoading: string =
        '<div class="loading-overlay">' +
          '<img src="assets/loader.gif" alt="logo Promax" height="130" class="img-loader" />'+
          '<div class="spinner">'+
            '<div class="bounce1"></div>'+
            '<div class="bounce2"></div>'+
            '<div class="bounce3"></div>'+
          '</div>'+
          '<h1 class="loading-venda">' +
          '{{message}}' +
          '</h1>' +
        '</div>';
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.finishedSync = true;
        this.authenticationService.logout();             
    }    

    login() {
        debugger;
        this.loading = true;
        this.finishedSync = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            (response) => {                
                debugger;
                this.router.navigate(['ranking']);              
            },
            (error) => this.handleError(error));
    }

    private handleError(error: any) {
        this.loading = false;
        alert(error.message);
        this.alertService.error(error.message);
    }
}
