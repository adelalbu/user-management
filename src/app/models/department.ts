export class Department {
    id?: number;
    name: string;
    description: string;
    parent? : Department;
    
 
    constructor(id: number, name: string, description: string, parent: Department) {
        this.id= id;
        this.name = name;
        this.description =description;
        this.parent =parent;
        
    }
}