import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private http: HttpClient, ) { }

  async findMany(): Promise<any> {
    try {
      const response = await this.http
        .get(`${environment.API}/empresa/findMany`)
        .toPromise();
      return response;
    } catch (error) {

      return error
    }
  }

  async create(empresa: any): Promise<any>  {
    try {
      const response = await this.http
        .post(`${environment.API}/empresa/create`, empresa)
        .toPromise()
      return response;
    } catch (error) {
      return error;
    }
  }




}