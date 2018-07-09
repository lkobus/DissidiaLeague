import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { EnvConfiguration } from './shared/config/env.config';
import { CaixaService } from './_services/caixa.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { Modulo, Empresa } from './_model/index';
import { Response } from '@angular/http';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
declare var ga:Function;

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent {
  private _showNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public showNavBarEmitter: Observable<boolean> = this._showNavBar.asObservable();


  teste: boolean = false;
  modulos: boolean;

  constructor(
    private alert: AlertService,
    private caixaService: CaixaService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics    
  ) {

      // Using Rx's built in `distinctUntilChanged ` feature to handle url change c/o @dloomb's answer
      router.events.distinctUntilChanged((previous: any, current: any) => {
          // Subscribe to any `NavigationEnd` events where the url has changed
          if(current instanceof NavigationEnd) {
              return previous.url === current.url;
          }
          return true;
      }).subscribe((x: any) => {             
          if(EnvConfiguration.ENV == "PROD"){
          ga('set', 'page', window.location.pathname);
          ga('send', 'pageview');
          }

      });
      
    IntervalObservable.create(2000)
    .subscribe(()=>{
      console.log(window.location.href);      
      this.angulartics2GoogleAnalytics.eventTrack("mytag", {
        path: window.location.pathname
      });
    });      

    console.log('Environment config', EnvConfiguration);
    window.localStorage.setItem('CONFIG_API', EnvConfiguration.API);
    window.localStorage.setItem('CURRENT_HOST', EnvConfiguration.CURRENT_HOST);
    try {
      this.authenticationService.loggedUserEmitter.subscribe((mode) => {
        if (mode != null) {
          this.teste = mode == 'anonimo' ? false : true;
        }
      });
      var regexp = new RegExp(':\d+/login')
      if (this.isUserLogged()) {
        if (regexp.test(window.location.href.toString())) {
          this.router.navigate(['home']);
        }
        var t = this.getModulesFromCurrentUser();
        this.showNavBar(this.isUserLogged());
        this.authenticationService.showModulos(this.getModulesFromCurrentUser());
        this.authenticationService.showUserLogged();
        this.caixaService.GetStatusCaixa().subscribe();
      } else {
        if (!(regexp.test(window.location.href.toString()))) {
          this.router.navigate(['login']);
        }
      }


      this.showNavBarEmitter.subscribe((mode) => {
        if (mode !== null) {
          this.teste = mode;
        }
      });
    }
    catch (e) { console.log(); }
  }

  getFranquia(): Empresa {
    if (localStorage.getItem('franquia')) {
      return JSON.parse(localStorage.getItem('franquia'));
    }
    return new Empresa();
  }

  getModulesFromCurrentUser(): boolean {
    var obj = JSON.parse(localStorage.getItem('userModulos'));
    return obj;
  }

  isUserLogged(): boolean {
    var user = localStorage.getItem('currentUser');
    return user !== null;
  }

  showNavBar(ifShow: boolean) {
    this._showNavBar.next(ifShow);
  }
}
