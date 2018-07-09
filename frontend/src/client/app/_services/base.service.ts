import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs, ResponseContentType } from '@angular/http';
import { EnvConfiguration } from '../shared/config/env.config';
import { GenericResponse } from '../_model/generic-response';

import { FileHolder } from '../angular2-image-upload/src/image-upload/image-upload.component';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

export abstract class BaseService {

    public http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /* Funções http auxiliares */
    doGet<T>(method: string): Observable<T> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        return this.http
            .get(this.BasePath() + method, { headers: headers })
            .map(response => this.GetResponse<T>(response))
            .catch(this.handleError);
    }

    doGetAny(method: string): Observable<any> {
      var headers = new Headers();
      this.contentTypeApplicationJson(headers);

      return this.http
          .get(this.BasePath() + method, { headers: headers });
    }

    doPut<T>(object: T, method: string): Observable<T> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        const url = this.BasePath() + method;
        const body = this.ConvertParamsJSON<T>(object);

        return this.http
            .put(url, body, { headers: headers })
            .map(response => { console.log(response); })
            .catch(this.handleError);
    }

    doPutWithoutBody<T>(method: string): Observable<T> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.put(this.BasePath() + method, { headers: headers })
            .map(response => { console.log(response); })
            .catch(this.handleError);
    }

    doPost<T>(object: T, method: string): Observable<any> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        const url = this.BasePath() + method;
        const body = this.ConvertParamsJSON<T>(object);

        return this.http.post(url, body, { headers: headers })
            .map(response => {
                console.log(response);
                try {
                    return this.GetResponse<T>(response);
                } catch (error) {
                    return null;
                }
            })
            .catch(this.handleError);
    }

    doPostOtherResult<T, Y>(object: T, method: string): Observable<Y> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        const url = this.BasePath() + method;
        const body = this.ConvertParamsJSON<T>(object);

        return this.http.post(url, body, { headers: headers })
            .map(response => { return this.GetResponse<Y>(response); })
            .catch(this.handleError);
    }

    doPostWithoutBody<T>(method: string): Observable<any> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        const url = this.BasePath() + method;

        return this.http.post(url, {}, { headers: headers })
            .map(response => { console.log(response); })
            .catch(this.handleError);
    }

    doPostCsv(fileHolder: FileHolder, method: string): any {
        var formData = new FormData();
        formData.append('csv', fileHolder.file);

        const url = this.BasePath() + method;
        return this.http
            .post(url, formData)
            .toPromise()
            .catch(this.handleError);
    }

    doDownloadFile(method: string): Observable<any> {
        var headers = new Headers();
        return this.http
            .get(this.BasePath() + method, { responseType: ResponseContentType.Blob })
            .map((response: Response) => {
                return {
                    fileName: response.headers
                        .get('Content-Disposition')
                        .split(';')[1]
                        .trim()
                        .split('=')[1]
                        .replace(/"/g, ''),
                    fileData: response.blob()
                };
            })
            .catch(this.handleError);
    }

    GetResponse<T>(response: Response) {
        try {
            return response.json() as T;
        } catch (err) {
            return null;
        }
    }

    ConvertParamsJSON<T>(body: T): string {
        return JSON.stringify(body);
    }

    contentTypeApplicationJson(headers: Headers) {
        headers.append('Content-Type', 'application/json');
    }

    contentTypeApplicationFormUrlEncoded(headers: Headers) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
    }

    BasePath(): string {
        return EnvConfiguration.API;
    }

    handleError(error: any): Observable<any> {
        console.error('An error occurred', error); // for demo purposes only
        var details;
        var response;
        try {
            details = error.json();
            if (details.message) {
                response = details;
            } else {
                response = JSON.parse(details);
            }
        } catch (Error) {
            console.log(Error);
        }
        return Observable.throw(response || { 'Message': '' + details });
    }

    handleErrorPromise(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        var details;
        var response;
        try {
            details = error.json();
            if (details.message) {
                response = details;
            } else {
                response = JSON.parse(details);
            }
        } catch (Error) {
            console.log(Error);
        }
        return Promise.reject(response || { 'Message': '' + details });
    }

    doDelete<T>(object: T, method: string): Observable<T> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        const body = this.ConvertParamsJSON<T>(object);

        return this.http.delete(this.BasePath() + method,
            new RequestOptions({ headers: headers, body: body }))
            .map(response => response.ok)
            .catch((err) => this.handleError(err));
    }
}
