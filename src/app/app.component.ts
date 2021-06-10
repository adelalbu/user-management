import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { NgbdSortableHeader, SortEvent } from "./sortable.directive";
import { DecimalPipe } from "@angular/common";
import { UserService } from "./user.service";
import { User } from "./models/user.model";
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from "@angular/common/http";
import { Department } from "./models/department";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [DecimalPipe, NgbModalConfig, NgbModal],
})
export class AppComponent  implements OnInit{
  title = "user-mgmt-app";

  public idExists:boolean = false;
  users$: Observable<User[]>;
  total$: Observable<number>;
  subject = new Subject<boolean>();
  public userToBeAdded: User = new User(0,'','','','','','',0,0,0, new Department(0, '',null, new Department(0,'',null,null))); 
  public userToBeEdited: User = new User(0,'','','','','','',0,0,0, new Department(0, '',null, new Department(0,'',null,null)));
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(config: NgbModalConfig, public service: UserService, private modalService: NgbModal, private http: HttpClient) {
    this.users$ = service.users$;
    this.total$ = service.total$;

    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.subject.subscribe(data => {
      this.idExists = data;
       })
  }


public checkId():void{
  this.service.checkIfUserExists().subscribe((data: User[]) => {
 
    let listOfUsersWithId = data.filter(user => user.id == this.userToBeAdded.id);
    if(listOfUsersWithId.length > 0){
      this.subject.next(true);
  
    }else{
      this.subject.next(false);
    }
  });
}

  onSort({ column, direction }: SortEvent): void {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  open(content) {
    this.modalService.open(content);
  }

  public editUser(userId: number): void {
    this.service.getUserById(userId);
    this.service.userToBeEditedSubject.subscribe(data => {
        this.userToBeEdited = data;
    });
  }

  public addUser(){
     this.userToBeAdded.name= (this.userToBeAdded.surname +" "+ this.userToBeAdded.firstname).toUpperCase();
     this.userToBeAdded.email = this.userToBeAdded.email.toUpperCase();

     this.http.post('http://localhost:3000/users', this.userToBeAdded).subscribe( result => {
       console.log(result);
     });
     window.location.reload();
  }

  public updateUser(){
     this.userToBeEdited.name= (this.userToBeEdited.surname +" "+ this.userToBeEdited.firstname).toUpperCase();
     this.userToBeEdited.email = this.userToBeEdited.email.toUpperCase();

     this.http.put('http://localhost:3000/users/' + this.userToBeEdited.id, this.userToBeEdited).subscribe( result => {
       console.log(result);
     });
     window.location.reload();
  }

  public deleteUser(){
    // this.http.delete('http://localhost:3000/users/' + this.userToBeEdited.id).subscribe( result => {

    // });

    // dont delete just put status on 0 (inactive)
    this.userToBeEdited.status = 0;
    this.http.put('http://localhost:3000/users/' + this.userToBeEdited.id, this.userToBeEdited).subscribe( result => {
      console.log(result);
    });

    window.location.reload();
  }
}
