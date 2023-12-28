import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, ) { }

  async findMany(): Promise<any> {
    try {
      const response = await this.http
        .get(`${environment.API}/usuario/findMany`)
        .toPromise();
      return response;
    } catch (error) {

      return error
    }
  }

  async create(usuario: any): Promise<any>  {
    try {
      const response = await this.http
        .post(`${environment.API}/usuario/create`, usuario)
        .toPromise()
      return response;
    } catch (error) {
      return error;
    }
  }




}