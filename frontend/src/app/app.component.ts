import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './utils/authentication.service';

export let logado = { logado: null };



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private authenticationService:AuthenticationService)  {}
  ngOnInit(): void {

  }
}
