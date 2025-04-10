import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  esAdmin$!: Observable<boolean>;
  usuario$!: Observable<any>;
  cantidadProductos: number = 0;
  private cartSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.esAdmin$ = this.authService.esAdmin$;
    this.usuario$ = this.authService.usuarioActual$;
    
    // Nos suscribimos al carrito para obtener la cantidad de productos
    this.cartSubscription = this.cartService.cart$.subscribe(productos => {
      this.cantidadProductos = productos.length;
    });
  }

  ngOnDestroy(): void {
    // Nos desuscribimos para evitar memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}