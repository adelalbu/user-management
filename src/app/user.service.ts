import { Injectable, PipeTransform } from "@angular/core";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { User } from "./models/user.model";
import { Observable, Subject, of, BehaviorSubject } from "rxjs";
import { SortColumn, SortDirection } from "./sortable.directive";
import { DecimalPipe, JsonPipe } from "@angular/common";
import { debounceTime, delay, map, switchMap, tap } from "rxjs/operators";
import { Department } from "./models/department";

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  filterTerm: string;
}
interface SearchResult {
  users: User[];
  total: number;
}
const compare = (
  v1: string | number | Department,
  v2: string | number | Department
) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(users: User[], column: SortColumn, direction: string): User[] {
  if (direction === "" || column === "") {
    return users;
  } else {
    return [...users].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === "asc" ? res : -res;
    });
  }
}

function matches(user: User, term: string, pipe: PipeTransform): any {
  return (
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
    // user.department.name.toLowerCase().includes(term) ||
    //pipe.transform(user.status).includes(term)
  );
}

@Injectable({
  providedIn: "root",
})
export class UserService {

  private apiUrl = "http://77.81.246.11:3000";

  private _search$ = new Subject<void>();
  private _loading$ = new Subject<boolean>();
  private _users$: Subject<User[]> = new Subject<User[]>();
  public users: User[] = [];

  get searchTerm() {
    return this._state.searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  get filterTerm() {
    return this._state.filterTerm;
  }

  set filterTerm(filterTerm: string) {
    this._set({ filterTerm });
  }

  get loading$() {
    return this._loading$;
  }
  constructor(private http: HttpClient, private pipe: DecimalPipe) {
    this.getAll().subscribe((data: User[]) => {
      this.users = data;
    });

    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._users$.next(result.users);
        this._total$.next(result.total);
      });

    this._search$.next();
  }


  public checkIfUserExists() {
        return this.getAll();
     }

  public resetFilter(): void {
    this.getAll().subscribe((data: User[]) => {
      this.users = data;
    });
    this._search$.next();
  }

  public getUsersFromDepartment(name: string): void {
    this.getAll().subscribe((data: User[]) => {
      this.users = [];
      for (let user of data) {
        if (user.department) {
          if (user.department.name == name) {
            this.users.push(user);
          }
        }
      }
      this._users$.next(this.users);
    });
  }

  public getUsersWithStatus(status: number): void {
    this.getAll().subscribe((data: User[]) => {
      this.users = [];
      for (let user of data) {
          if (user.status == status) {
            this.users.push(user);
          }
      }
      this._users$.next(this.users);
    });
  }

  get users$() {
    return this._users$.asObservable();
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortColumn: "",
    sortDirection: "",
    filterTerm: "",
  };

  get pageSize() {
    return this._state.pageSize;
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  get page() {
    return this._state.page;
  }

  set page(page: number) {
    this._set({ page });
  }

  private _total$ = new Subject<number>();

  get total$() {
    return this._total$.asObservable();
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let users = sort(this.users, sortColumn, sortDirection);

    // 2. filter
    users = users.filter((user) => matches(user, searchTerm, this.pipe));
    const total = users.length;

    // 3. paginate
    users = users.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );

    return of({ users, total });
  }

  public userToBeEditedSubject = new BehaviorSubject<User>(new User(0,'','','','','','',0,0,0, new Department(0, '',null, new Department(0,'',null,null))));
  public getUserById(userId: number) {

    this.http.get(this.apiUrl+'/users', {params: new HttpParams().set('id', userId+'')})
      .pipe(map(res => {
        return res[0];
      }))
      .subscribe(user => {
        this.userToBeEditedSubject.next(user);

      });
  }
}
