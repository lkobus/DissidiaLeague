import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class ToastService {
    constructor(private _serviceNotification: NotificationsService,) { }

    sucessNotification(title: string, text: string): void {
      this._serviceNotification.success(
        title,
        text,
        {
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    errorNotification(title: string, text: string): void {
      this._serviceNotification.error(
        title,
        text,
        {
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    warningNotification(title: string, text: string): void {
      this._serviceNotification.warn(
        title,
        text,
        {
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    alertNotification(title: string, text: string): void {
      this._serviceNotification.alert(
        title,
        text,
        {
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    bareNotification(title: string, text: string): void {
      this._serviceNotification.bare(
        title,
        text,
        {
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    infoNotification(title: string, text: string): void {
      this._serviceNotification.info(
        title,
        text,
        {
            timeOut: 3000,
            showProgressBar: false,
            pauseOnHover: false,
            clickToClose: true,
            animate: 'scale',
            position: ['top']
        }
      );
    }

    clearAllNotifications(): void {
      this._serviceNotification.remove(null);
    }
}
