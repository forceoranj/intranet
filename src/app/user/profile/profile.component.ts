import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { CrudService } from '../../services/crud.service';    // CRUD services API
import { Member } from '../../classes/member';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Reactive form services
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr'; // Alert message using NGX toastr


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  public memberForm: FormGroup;  // Define FormGroup to student's form
  yearList: number[] = [2020, 2019, 2018, 2017, 2016];
  selectedFiles: any;
  fileUploadQueue: any;

  constructor(
    public crudApi: CrudService,  // CRUD API services
    public fb: FormBuilder,       // Form Builder service for Reactive forms
    public toastr: ToastrService,  // Toastr service for alert message
    public afs: AngularFirestore,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.crudApi.GetStudentsList();  // Call GetStudentsList() before main form is being called
    this.studenForm();              // Call student form when component is ready
  }

  // Reactive student form
  studenForm() {
    this.memberForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      mobile: ['', [Validators.required, Validators.pattern("(\\+|[0-9])[0-9] ?[0-9][0-9] ?[0-9][0-9] ?[0-9][0-9] ?[0-9][0-9]")]],
      photo: ['', [Validators.required, Validators.minLength(2)]],
      english: ['', []],
      spanish: ['', []],
      german: ['', []],
      italian: ['', []],
      lsf: ['', []],
      years: ['', []],
      adult: ['', [Validators.requiredTrue]],
    });
  }

  // Accessing form control using getters
  get firstname() {
    return this.memberForm.get('firstname');
  }

  get lastname() {
    return this.memberForm.get('lastname');
  }

  get mobile() {
    return this.memberForm.get('mobile');
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
}

  // Reset student form's values
  ResetForm() {
    this.memberForm.reset();
  }

  submitStudentData() {
    this.crudApi.AddStudent(this.memberForm.value); // Submit student data using CRUD API
    this.toastr.success(this.memberForm.controls['firstName'].value + ' successfully added!'); // Show success message when data is successfully submited
    this.ResetForm();  // Reset form when clicked on reset button
  };



  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: Member = {
      uid: user.uid,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      photo: user.photo,
    }
    return userRef.set(userData, {
      merge: true
    })
  }

}
