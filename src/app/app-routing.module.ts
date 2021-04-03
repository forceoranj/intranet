import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as _ from 'lodash-es';

//Auth
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

import { MenuService } from "./services/menu.service";
import { UserResolver } from "./services/user.resolver";

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { UsersComponent } from './admins/users/users.component';
import { ProfileComponent } from './users/profile/profile.component';
import { KnowledgeComponent } from './members/knowledge/knowledge.component';

const routes: Routes = [
  { path: '', redirectTo: 'users/profile', pathMatch: 'full' },
  { path: 'login',component:  LoginComponent, data: {title: "Identification"}},
  { path: 'register', component:  RegisterComponent, data: {title: "Inscription"}},
  { path: 'forgot-password', component:  ForgotPasswordComponent, data: {title: "Réinitialisation du mot de passe"}},
  { path: 'verify-email', component:  VerifyEmailComponent, data: {title: "Verification de l'email"}},
  { path: 'admins/users', component: UsersComponent, canActivate: [AuthGuard], data: {title: "Gestion des utilisateurs"} },
  { path: 'users/profile', component: ProfileComponent, canActivate: [AuthGuard], data: {title: "Profil pour devenir bénévole"} },
  { path: 'members/knowledge', component: KnowledgeComponent/*, canActivate: [AuthGuard]*/, data: {title: "Connaissance des jeux"} },
  { path: 'dashboard', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
];
for (let route of routes) {
  if (!_.includes(["login", "register", "forgot-password", "verify-email"], route.path)) {
    route.resolve = { user: UserResolver };
  }
}

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [ RouterModule ],
  providers: [
    AuthService,
    MenuService,
  ],
})
export class AppRoutingModule {}
