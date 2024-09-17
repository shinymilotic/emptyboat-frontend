import { Component, Input } from "@angular/core";
import { NgForOf } from "@angular/common";
import { ApiError } from "../../models/apierrors.model";

@Component({
  selector: "app-list-errors",
  templateUrl: "./list-errors.component.html",
  styleUrls: ["./list-errors.component.css"],
  imports: [NgForOf],
  standalone: true,
})
export class ListErrorsComponent {
  errorList!: ApiError;

  @Input() set errors(errorList: ApiError) {
    this.errorList = errorList;
  }
}
