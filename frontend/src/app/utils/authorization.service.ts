import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { StorageService } from './storage.service';
import { Observable, from, of } from 'rxjs';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';



@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(
    private router: Router,
    private storage: StorageService,
    private authentication: AuthenticationService,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const rota = state.url;
    const logado = await this.authentication.getLogUser()
    const empregador = [
      '/home',

    ]
    const colaborador = [
      '/home',

    ]


    const token = await this.authentication.getToken();
    
    if (token) {
      if (logado.tipo.toUpperCase() === 'ADMIN' || rota === '/' || rota === '/login')
        return true;

      this.router.navigate(['/']);

      return false;
    } else {
      this.router.navigate(['login']);
      return false
    }
  }
}