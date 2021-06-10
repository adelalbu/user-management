import { Department } from './department';

export class User {
    id?: number;
    firstname: string;
    surname: string;
    name: string;
    email: string;
    urlGoogleScholar: string;
    domain: string;
    domainId? : number;
    permissions: number;
    status: number;
    department?: Department;

	constructor(id:number, firstname: string, surname: string, name: string, email: string, urlGoogleScholar: string, domain: string, domainId: number, permissions: number, status: number, department: Department) {
    
    this.id= id;
    this.firstname = firstname;
    this.surname = surname;
    this.name= name;
    this.email = email;
    this.urlGoogleScholar = urlGoogleScholar;
    this.domain = domain;
    this.domainId = domainId;
    this.permissions = permissions;
    this.status = status;
    this.department = department;
    
    }

}