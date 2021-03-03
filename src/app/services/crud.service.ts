import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { AngularFireStorage } from '@angular/fire/storage';  // Firebase modules for Database, Data list and Single object
import { ToastrService } from 'ngx-toastr'; // Alert message using NGX toastr
import { Member } from '../classes/member';
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
  membersRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  memberRef: AngularFireObject<any>;   // Reference to Student object, its an Observable too

  // Inject AngularFireDatabase Dependency in Constructor
  constructor(
    private db: AngularFireDatabase,
    private photoDb: AngularFireStorage,
    public toastr: ToastrService,
  ) { }

  // Create Student
  AddMember(uid: string, member: Member) {
    const userData = {
      profile: member,
    };
    this.db.database.ref('users/' + uid).set(userData);
    //this.db.object('users/' + uid).update(userData);
    // this.membersRef = this.db.list('users');
    // this.membersRef.push(userData);
  }

  addMemberPhoto(uid: string, photo: File) {
    if (photo.size >= 5 * 1024 * 1024) {
      this.toastr.error("Seules les images de moins de 5MO sont supportées.")
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
    const ref = this.photoDb.ref(storageFilename);
    ref.put(photo);
  }

  // Fetch Single Student Object
  GetStudent(id: string) {
    this.memberRef = this.db.object('students-list/' + id);
    return this.memberRef;
  }

  // Fetch Students List
  GetStudentsList() {
    this.membersRef = this.db.list('users');
    return this.membersRef;
  }

  // Update Student Object
  UpdateStudent(student: Student) {
    this.memberRef.update({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      mobileNumber: student.mobileNumber
    })
  }

  // Delete Student Object
  DeleteStudent(id: string) {
    this.memberRef = this.db.object('students-list/'+id);
    this.memberRef.remove();
  }

}
