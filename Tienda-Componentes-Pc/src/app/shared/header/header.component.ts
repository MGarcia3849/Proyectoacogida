import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  esAdmin$!: Observable<boolean>;
  usuario$!: Observable<any>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.esAdmin$ = this.authService.esAdmin$;
    this.usuario$ = this.authService.usuarioActual$;
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
