import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {

  userLog: any;
  private token: string = "";
  private loggedIn = new BehaviorSubject<boolean>(false);

  private usuarioLogadoSubject = new BehaviorSubject<any>({ id: 0 });
  public usuarioLogado$: Observable<any> = this.usuarioLogadoSubject.asObservable();

  constructor(private http: HttpClient, private storage: StorageService,
    private router: Router) {
  }

  async ngOnInit() {
    await this.init()
  }

  async handleSessionExpiration(response: any): Promise<void> {
    if (response?.error?.auth == false) {
      await this.logout();
    }
  }

  async init() {
    await this.getLogUser()
    await this.reloadIfTokenIsNull();
  }

  async getLogUser() {
    try {
      this.userLog = await this.storage.get("user");
      const user = this.userLog ? JSON.parse(this.userLog) : { id: 0 };
      this.usuarioLogadoSubject.next(user);
      return user;
    } catch (e) {
      return { id: 0, nome_completo: '' };
    }
  }

  async getisLoggedIn() {
    await this.init()
    if (this.token) {
      await this.validate()
    }
    return this.loggedIn.asObservable();
  }

  async setLogUser(usuario: any) {
    this.userLog = usuario;
    await this.storage.set("user", usuario);
  }

  async loginColaborador(usuario: { cpf: string; senha: string; }): Promise<boolean> {
    if (!usuario) {
      return false;
    }
  
    try {
      const resultado: any = await this.http.post<any>(`${environment.API}/usuario/login`, usuario).toPromise();
  
      let nomeArquivo = 'felipe.png';
      const imageResponse: any = await this.http.get(`${environment.API}/arquivos/${nomeArquivo}`, { responseType: 'blob' }).toPromise();
  
      if (!imageResponse) {
        throw new Error('Erro ao obter a imagem do perfil');
      }
  
      const imageBlob: Blob = imageResponse as Blob;
  
      const reader = new FileReader();
      const readerPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
  
      reader.readAsDataURL(imageBlob);
      const imageDataURL: string = await readerPromise;
  
      resultado.data.foto = imageDataURL;
  
      this.token = resultado.token;
      this.storage.set("token", this.token);
      this.storage.set("user", resultado.data);
      this.loggedIn.next(true);
      
      return true;
    } catch (error) {
      this.token = "";
      return false;
    }
  }
  
  

  async loginEmpresa(empresa: { cnpj: string; senha: string; }): Promise<boolean> {
    if (!empresa) {
      return false;
    }
  
    try {
      const resultado: any = await this.http.post<any>(`${environment.API}/empresa/login`, empresa).toPromise();
  
      let nomeArquivo = 'kiporcao.jpg';
      const imageResponse: any = await this.http.get(`${environment.API}/arquivos/${nomeArquivo}`, { responseType: 'blob' }).toPromise();
  
      if (!imageResponse) {
        throw new Error('Erro ao obter a imagem do logo da empresa');
      }
  
      const imageBlob: Blob = imageResponse as Blob;
  
      const reader = new FileReader();
      const readerPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
  
      reader.readAsDataURL(imageBlob);
      const imageDataURL: string = await readerPromise;
  
       resultado.data.foto = imageDataURL;
  
      this.token = resultado.token;
      this.storage.set("token", this.token);
      this.storage.set("user", resultado.data);
      this.loggedIn.next(true);
  
      return true;
    } catch (error) {
      this.token = "";
      return false;
    }
  }
  

  async validate(): Promise<boolean> {
    await this.reloadIfTokenIsNull();
    return this.http
      .get<boolean>(`${environment.API}/usuario/validate/valid`)
      .toPromise()
      .then((response: any) => {
        if (response.auth == true) {
          this.loggedIn.next(true);
          return true;
        } else {
          this.loggedIn.next(false);
          this.logout()
          return false;
        }
      })
      .catch(async (err) => {
        console.log(err)
        return false;
      });
  }

  async logout() {
    this.loggedIn.next(false)
    this.token = "";
    await this.storage.remove("token");
    await this.storage.remove("user");
    this.router.navigate(['login']);
  }

  async getToken() {
    await this.reloadIfTokenIsNull();
    return this.token;
  }

  async isLogado() {
    let token = await this.getToken()
    return token ? true : false;
  }

  private async reloadIfTokenIsNull() {
    if (this.token == null || this.token == undefined) {
      const tokenWithQuotes = await this.storage.get("token");
      // Remova as aspas duplas usando o método replace
      if (tokenWithQuotes) {
        this.token = tokenWithQuotes.replace(/["']/g, ''); // Isso remove todas as aspas duplas na string
      }
    }
    return this.token;
  }
}