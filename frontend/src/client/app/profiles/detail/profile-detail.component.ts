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
  selector: 'profile-detail',
  templateUrl: 'profile-detail.component.html',
  styleUrls: ['profile-detail.component.css']
})

export class ProfileDetailComponent implements OnInit {
  
  
  imageUrl:string;
  whoWins:string = "A";
  playerTeamA1: string;
  playerTeamA2: string;
  playerTeamA3: string;

  playerTeamB1: string;
  playerTeamB2: string;
  playerTeamB3: string;

  scorePlayerTeamA1: number;
  scorePlayerTeamA2: number;
  scorePlayerTeamA3: number;

  scorePlayerTeamB1: number;
  scorePlayerTeamB2: number;
  scorePlayerTeamB3: number;

  charPlayerTeamA1: number = 0;
  charPlayerTeamA2: number = 0;
  charPlayerTeamA3: number = 0;

  charPlayerTeamB1: number = 0;
  charPlayerTeamB2: number = 0;
  charPlayerTeamB3: number = 0;
  
  matchId: string;
  

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

