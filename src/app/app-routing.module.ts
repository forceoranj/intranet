import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Auth
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { ProfileComponent } from './user/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'login',component:  LoginComponent},
  { path: 'register', component:  RegisterComponent },
  { path: 'forgot-password', component:  ForgotPasswordComponent },
  { path: 'verify-email', component:  VerifyEmailComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [ RouterModule ],
  providers: [AuthService],
})
export class AppRoutingModule {}