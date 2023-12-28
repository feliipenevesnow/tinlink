import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private static socket: Socket;
  private newNotificationsSubject = new Subject<boolean>();

  constructor(private authenticationService: AuthenticationService) {
  }

  init(): void {
    SocketService.socket = io(environment.SOCKET); // Substitua pela URL do seu servidor Socket.IO

    SocketService.socket.on('connect', () => {
      this.subscribeToNotifications()
    });

    SocketService.socket.on('error', (error: any) => {
      console.error('Socket.IO error:', error);
    });
  }

  getSocket(): any {
    return SocketService.socket;
  }

  subscribeToNotifications(): Observable<boolean> {
    SocketService.socket.on('newNotifications', () => {
      this.newNotificationsSubject.next(true);
    });
    return this.newNotificationsSubject.asObservable();
  }

  async sendUserLogBackend() {
    let userLog = await this.authenticationService.getLogUser()
    SocketService.socket.emit("userConnected", { userId: userLog.id })
  }

  disconnecting(): void {
    SocketService.socket.disconnect();
  }
}