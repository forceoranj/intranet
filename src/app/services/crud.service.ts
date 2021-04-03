import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { Observable, Subscriber } from 'rxjs';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { DatabaseReference } from '@angular/fire/database/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from "../auth/auth.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { Profile } from '../classes/profile';
import { Roles } from '../classes/roles';
import { DBUser } from '../classes/user';
export interface Student {
  $key: string;
  firstName: string;
  lastName: string;
  email: string
  mobileNumber: Number;
}
@Injectable({
  providedIn: 'root'
})

export class CrudService {
  profilesRef: AngularFireList<any>;
  profileRef: AngularFireObject<any>;
  snapshot: DatabaseReference;
  userObserver: Subscriber<DBUser>;
  user: DBUser;


  constructor(
    private db: AngularFireDatabase,
    private photoDb: AngularFireStorage,
    public authService: AuthService,
    public toastr: ToastrService,
  ) { }


  async setProfile(profile?: Profile, uid?: string): Promise<void> {
    uid ||= await this.authService.uid;
    const dbProfile = JSON.parse(JSON.stringify(profile));
    console.log("dbProfile in setProfile", JSON.stringify(dbProfile));
    this.db.database.ref(`users/${uid}/profile`).set(dbProfile);
  }


  async setRoles(roles?: Roles, uid?: string): Promise<void> {
    uid ||= await this.authService.uid;
    let dbRoles = null;
    if (!_.isEmpty(roles)) {
      dbRoles = _.pickBy(roles);
    }
    console.log("dbRoles in setRoles", JSON.stringify(dbRoles));
    this.db.database.ref(`users/${uid}/roles`).set(dbRoles);
  }

  async setProfilePhoto(photo: File, uid?: string): Promise<void> {
    uid ||= await this.authService.uid;
    if (photo.size >= 100 * 1024) {
      this.toastr.error("Seules les images de moins de 100 KO sont supportées.")
      return;
    }
    const extensionMatch = photo.name.match(/\.(jpg|jpeg|png)/i);
    if (!extensionMatch) {
      this.toastr.error("Seuls les fichiers jpg, jpeg et png sont supportés.")
      return;
    }
    const extension = extensionMatch[0].toLowerCase();
    const storageFilename = '/profiles/' + uid + extension;
    console.log("storageFilename", storageFilename);
    if (environment.production) {
      const ref = this.photoDb.ref(storageFilename);
      ref.put(photo);
    }
  }


  async getUser(uid?: string): Promise<DBUser> {
    uid ||= await this.authService.uid;
    if (!uid) {
      return;
    }
    console.log("uid in getUser", uid);
    if (this.snapshot) {
      return this.user;
    }
    //else
    this.snapshot = await this.db.database.ref('users/' + uid);
    return new Promise<DBUser>(resolve => {
      this.snapshot.on('value', (snapshot) => {
        this.user = snapshot.exists() && snapshot.val() || {};
        _.defaults(this.user, {roles: {}});
        this.userObserver?.next(this.user);
        resolve(this.user);
      });
    });
  }


  //TODO1 is userObserver crushed each time onUserChange is called?
  onUserChange = new Observable<DBUser>(observer => {
    this.userObserver = observer;
  });


  async getAdminUid(): Promise<string> {
    const snapshot = await this.db.database.ref('admins/').get();
    return snapshot.exists() ? snapshot.val() : "";
  }



  GetStudentsList() {
    this.profilesRef = this.db.list('users');
    return this.profilesRef;
  }


  UpdateStudent(student: Student) {
    this.profileRef.update({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      mobileNumber: student.mobileNumber
    })
  }


  DeleteStudent(id: string) {
    this.profileRef = this.db.object('students-list/'+id);
    this.profileRef.remove();
  }

  async becomeAdmin(): Promise<void> {
    const uid = await this.authService.uid;

    await this.db.database.ref('admins/'+ uid).set(true);

    const userData = await this.getUser() || {};
    const roles: Roles = userData.roles || {};
    roles.admin = true;
    this.setRoles(roles);
  }
}
