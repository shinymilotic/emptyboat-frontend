import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared/list-errors/list-errors.component";
import { UserService } from "src/app/core/services/user.service";
import { ApiError } from "src/app/core/models/apierrors.model";
@Component({
    selector: "app-confirm-email",
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.css"],
    standalone: true,
    imports: [RouterLink, ListErrorsComponent, ReactiveFormsModule]
})
export class ConfirmEmailComponent implements OnInit {
  private isConfirmed: boolean = false;
  private errors!: ApiError;

  constructor(private route: ActivatedRoute,
    private readonly userService: UserService) {
  }

  ngOnInit(): void {
    const token :string = this.route.snapshot.params["token"];
    this.userService.confirmEmail(token).subscribe({
      next: () => {
          this.isConfirmed = true;
      },
      error: (errors) => {
        this.errors = errors;
      }
    });
  }

  getIsConfirmed() : boolean {
    return this.isConfirmed;
  }
}
