import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { KakaoCallbackComponent } from './call-back/kakao-callback/kakao-callback.component';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/supply', pathMatch: 'full' },
  {
    path: 'kakaoCallback',
    component: KakaoCallbackComponent,
    canLoad: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthPageModule'
  },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canLoad: [AuthGuard]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
