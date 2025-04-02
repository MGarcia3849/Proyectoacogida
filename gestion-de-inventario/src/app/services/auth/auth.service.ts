import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'assets/usuarios.json';
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión
  login(email: string, contraseña: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        console.log('Usuarios cargados: ', users); // Depuración
        const user = users.find(u => u.email === email && u.password === contraseña);

        if (user) {
          console.log('Usuario autenticado: ', users); // Depuración
          this.currentUserSubject.next(user);
          return user;

        } else {
          console.log('Usuario erroneo: ', users); // Depuración
          throw new Error('Usuario o contraseña incorrectos');
        }
      })
    );
  }

  // Método para cerrar sesión
  logout() {
    this.currentUserSubject.next(null);
  }
}
