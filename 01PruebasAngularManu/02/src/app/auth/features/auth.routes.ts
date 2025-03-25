import { routes } from '@anugular/router';
export default [
  {
    path: 'sing-in',
    loadComponent: () =>  import('.sign-in/sign-in.component'),
  },
  {
    path: 'sign-up',
    loadComponent: () =>  import('.sign-un/sign-in.component'),
  }
] as routes
