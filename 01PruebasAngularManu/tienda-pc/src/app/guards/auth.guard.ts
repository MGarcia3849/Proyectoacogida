import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { authState } from 'rxfire/auth';

export const isLoggedInGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return authState(auth).pipe(map(user => !!user)); // solo deja pasar si hay usuario
};

