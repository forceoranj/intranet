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
import { ProfileComponent } from './users/profile/profile.component';
import { KnowledgeComponent } from './volunteers/knowledge/knowledge.component';

const routes: Routes = [
  { path: '', redirectTo: 'users/profile', pathMatch: 'full' },
  { path: 'login',component:  LoginComponent, data: {title: "Identification"}},
  { path: 'register', component:  RegisterComponent, data: {title: "Inscription"}},
  { path: 'forgot-password', component:  ForgotPasswordComponent, data: {title: "Réinitialisation du mot de passe"}},
  { path: 'verify-email', component:  VerifyEmailComponent, data: {title: "Verification de l'email"}},
  { path: 'users/profile', component: ProfileComponent, canActivate: [AuthGuard], data: {title: "Profil pour devenir bénévole"} },
  { path: 'volunteers/knowledge', component: KnowledgeComponent, canActivate: [AuthGuard], data: {title: "Connaissance des jeux"} },
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
