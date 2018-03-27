import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
@Injectable()
export class HTTPSerivce {
    constructor(private http: Http) { }
    getRequest(url): Observable<any> {
        console.log('HTTPSerivce', url);
        return this.http.get(url)
        .map(function(res){
            return res.json();
        });

    }

}