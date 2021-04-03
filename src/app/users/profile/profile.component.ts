import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { AuthService } from "../../auth/auth.service";
import { CrudService } from '../../services/crud.service';
import { Profile, FormProfile } from '../../classes/profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';
import { DBUser } from '../../classes/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  public profileForm: FormGroup;
  yearList: number[] = [2020, 2019, 2018, 2017, 2016];
  selectedFiles: any;
  fileUploadQueue: any;
  photoFile: any;
  canBecomeAdmin = false;
  isAdmin = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public crudService: CrudService,
    public fb: FormBuilder,
    public toastr: ToastrService,
    public afs: AngularFirestore,
    public authService: AuthService,
  ) {
    this.activatedRoute.data.subscribe(async (data: {user: DBUser}) => {
      this.createForm(data.user.profile);
      this.isAdmin = data.user.roles.admin;
      this.canBecomeAdmin = await this.crudService.getUser() && await this.crudService.getAdminUid() === "";
      this.onChanges();
    });
  }

  createForm(profile: Profile): void {
    if (!this.profileForm) {
      this.profileForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        mobile: ['', [Validators.required, Validators.pattern("(\\+|[0-9])[0-9] ?[0-9][0-9] ?[0-9][0-9] ?[0-9][0-9] ?[0-9][0-9]")]],
        photo: ['', [Validators.required]],
        english: ['', []],
        spanish: ['', []],
        german: ['', []],
        italian: ['', []],
        lsf: ['', []],
        years: ['', []],
        adult: ['', [Validators.required, Validators.requiredTrue]],
      });
    }

    console.log("profile in setForm", JSON.stringify(profile));
    const defaultProfile = new FormProfile();
    if (!environment.production) {
      defaultProfile.firstname = "pi";
      defaultProfile.lastname = "sc";
      defaultProfile.mobile = "0102030405";
    }
    const formProfile: FormProfile = _.defaults(profile || {}, defaultProfile)
    if (profile) {
      formProfile.adult = true;
    }
    console.log("setProfile", formProfile);
    this.profileForm.setValue(formProfile);
  }

  onChanges(): void {
    this.profileForm.valueChanges.subscribe(async (user) => {
      console.log("profileForm change", this.profileForm.invalid);
      if (this.profileForm.invalid) {
        await this.setUserData(null);
      }
      else {
        await this.setUserData(user);
      }
      //TODOx if crud.onUserChange is not called, call this: this.rolesService.changeObserver.next();
    });
  }


  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }


  async upload(event): Promise<void> {
    this.photoFile = event.target.files[0];
    if (this.photoFile) {
      this.crudService.setProfilePhoto(this.photoFile);
    }
  }

  async setUserData(profile: FormProfile): Promise<void> {
    let dbProfile: Profile = profile && {
      firstname: profile.firstname,
      lastname: profile.lastname,
      mobile: profile.mobile,
      years: "",  //TODO1

      english: !!profile.english || undefined,
      spanish: !!profile.spanish || undefined,
      german: !!profile.german || undefined,
      italian: !!profile.italian || undefined,
      lsf: !!profile.lsf || undefined,
    };
    dbProfile = JSON.parse(JSON.stringify(dbProfile));

    this.crudService.setProfile(dbProfile);
    //TODOx if crud.onUserChange is not called, call this: this.rolesService.changeObserver.next();
  }


  becomeAdmin(): void {
    this.crudService.becomeAdmin();
  }


}
