import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  constructor(public service: UserService) {}

  public selectDepartment(name: string): void {
    this.service.getUsersFromDepartment(name);
  }

  public selectStatus(status: number): void {
    this.service.getUsersWithStatus(status);
  }

  public resetFilter(): void {
    this.service.resetFilter();
  }
}
