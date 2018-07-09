import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormsModule, NgModel, NG_VALIDATORS, Validator,
  Validators, AbstractControl, Form, ValidatorFn
} from '@angular/forms';
import { ToastService } from '../../_services/toast.service';

@Component({
  moduleId: module.id,
  selector: 'ranking-detail',
  templateUrl: 'ranking-detail.component.html',
  styleUrls: ['ranking-detail.component.css']
})

export class RankingDetailComponent implements OnInit {
  
  constructor(
    private toastService: ToastService,    
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    
  }  

  private handleError(error: any) {
    var message = 'Erro desconhecido ao salvar';
    if (error.Message || error.message) {
      message = error.Message != null ? error.Message : error.message;
    }

    this.toastService.errorNotification('Erro', message);
  }
}

