import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs, ResponseContentType } from '@angular/http';
import { EnvConfiguration } from '../../shared/config/env.config';
import { BaseService } from '../../_services/base.service';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class StatusService extends BaseService {

    private readonly BASE_PATH = 'status/';

    public StatusPush: string;
    public StartPush: string;
    public StopPush: string;
    public StatusPull: string;
    public StartPull: string;
    public StopPull: string;
    public Version: string;

    constructor(http: Http) {
        super(http);
    }

    getStatusPush(): any {
        return this.doGet<string>(this.BASE_PATH + 'push/status')
            .subscribe(status => this.StatusPush = status);
    }

    getStartPush(): void {
        this.doGet<string>(this.BASE_PATH + 'push/start')
            .subscribe(status => this.StartPush = status);
    }

    getStopPush(): void {
        this.doGet<string>(this.BASE_PATH + 'push/stop')
            .subscribe(status => this.StopPush = status);
    }

    getStatusPull(): any {
        return this.doGet<string>(this.BASE_PATH + 'pull/status')
            .subscribe(status => this.StatusPull = status);
    }

    getStartPull(): void {
        this.doGet<string>(this.BASE_PATH + 'pull/start')
            .subscribe(status => this.StartPull = status);
    }

    getStopPull(): void {
        this.doGet<string>(this.BASE_PATH + 'pull/stop')
            .subscribe(status => this.StopPull = status);
    }

    getCurrentVersion(): Observable<Response> { 
        return this.http.get(EnvConfiguration.API + 'update/CurrentVersion');                
    }

    getHasNewVersion(version:string): Observable<Response> { 
        return this.http.get("http://{UPDATE_IP}:62224/rtm/update/HasNewVersion/" + version);                
    }

    getCheckDownloadProgress(): Observable<Response> {
        return this.http.get(EnvConfiguration.API + "update/CheckDownloadProgress");
    }

    startDownload(version:string) : Observable<Response> {
        return this.http.get(EnvConfiguration.API + "/update/DownloadLastVersion/" + version);
    }
}