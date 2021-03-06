import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { CrudService } from '../../services/crud.service';    // CRUD services API
import { Member } from '../../classes/member';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Reactive form services
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr'; // Alert message using NGX toastr


@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrls: ['./knowledge.component.css']
})

export class KnowledgeComponent implements OnInit {

  public memberForm: FormGroup;  // Define FormGroup to student's form
  yearList: number[] = [2020, 2019, 2018, 2017, 2016];
  selectedFiles: any;
  fileUploadQueue: any;
  photoFile: any;

  constructor(
    public crudApi: CrudService,  // CRUD API services
    public fb: FormBuilder,       // Form Builder service for Reactive forms
    public toastr: ToastrService,  // Toastr service for alert message
    public afs: AngularFirestore,
    public authService: AuthService,
  ) { }

  async ngOnInit() {
    this.crudApi.GetStudentsList();  // Call GetStudentsList() before main form is being called
    await this.studenForm();              // Call student form when component is ready
    this.onChanges();
  }

  // Reactive student form
  async studenForm() {
    this.memberForm = this.fb.group({
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
      adult: ['', [Validators.requiredTrue]],
    });

    const defaultMember = {
      firstname: "pi",
      lastname: "sc",
      mobile: "0102030405",
      photo: "",  //TODO1 doesn't set anything, does it?
      english: false,
      spanish: false,
      german: false,
      italian: false,
      lsf: false,
      years: "",
      adult: false,
    };
    const member = await this.crudApi.getMember(this.authService.uid) || defaultMember;
    console.log("member", member);
    this.memberForm.setValue(member);
  }

  onChanges(): void {
  this.memberForm.valueChanges.subscribe(user => {
    if (this.memberForm.invalid) {
      return;
    }
    //else
    this.setUserData(user);
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


  upload(event) {
    this.photoFile = event.target.files[0];
    if (this.photoFile) {
      this.crudApi.addMemberPhoto(this.authService.uid, this.photoFile);
    }
  }

  setUserData(user) {
    const member: Member = {
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
      years: "",  //TODO1

      english: !!user.english || null,
      spanish: !!user.spanish || null,
      german: !!user.german || null,
      italian: !!user.italian || null,
      lsf: !!user.lsf || null,
    };

    console.log("member", member);
    //console.log("NOT SENDING MEMBER");
    this.crudApi.addMember(this.authService.uid, member);
    this.authService.roleChangeObserver.next();
  }

}
