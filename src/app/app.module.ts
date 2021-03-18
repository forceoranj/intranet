import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from '../environments/environment';
import { InMemoryDataService } from './in-memory-data.service';


import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireAuth } from  "@angular/fire/auth";
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { ProfileComponent } from './users/profile/profile.component';
import { KnowledgeComponent } from './volunteers/knowledge/knowledge.component';



const materialModules = [
  CdkTreeModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  MatBadgeModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatTooltipModule,
  MaterialFileInputModule,
  FlexLayoutModule,
];

// const config = {
//   apiKey: "AIzaSyA0wfti670ANrEq6N7H_f4YG_ZdsYBCndk",
//   authDomain: environment.firebaseEmulator
//   ? "localhost:9099"
//   : "forceoranj.firebaseapp.com",
//   databaseURL: environment.firebaseEmulator
//   ? "http://localhost:9000/?ns=forceoranj-default-rtdb"
//   : "https://forceoranj-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "forceoranj",
//   storageBucket: "forceoranj.appspot.com",
//   messagingSenderId: "308769634451",
//   appId: "1:308769634451:web:c2aaa11fce42e6d7b0b566"
// };

const config = environment.firebaseEmulator ? {
  apiKey: "AIzaSyA0wfti670ANrEq6N7H_f4YG_ZdsYBCndk",
  authDomain: "localhost:9099",
  databaseURL: "http://localhost:9000/?ns=forceoranj-default-rtdb",
} : {
  apiKey: "AIzaSyA0wfti670ANrEq6N7H_f4YG_ZdsYBCndk",
  authDomain: "forceoranj.firebaseapp.com",
  databaseURL: "https://forceoranj-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forceoranj",
  storageBucket: "forceoranj.appspot.com",
  messagingSenderId: "308769634451",
  appId: "1:308769634451:web:c2aaa11fce42e6d7b0b566"
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ...materialModules,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      extendedTimeOut: 5000,
    }),
  ],
  exports: [
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    HeroSearchComponent,
    ProfileComponent,
    KnowledgeComponent,

    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private _angularFireAuth: AngularFireAuth) {
    if (environment.firebaseEmulator) {
      this._angularFireAuth.useEmulator('http://localhost:9099');
    }
  }
}
