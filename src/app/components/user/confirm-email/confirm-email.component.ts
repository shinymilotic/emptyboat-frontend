import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { UserService } from "src/app/services/user.service";
import { ApiError } from "src/app/models/apierrors.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute,
    private readonly userService: UserService) {
  }

  ngOnInit(): void {
    const token :string = this.route.snapshot.params["token"];
    this.userService.confirmEmail(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
            this.isConfirmed = true;
        },
        error: (errors: ApiError) => {
          this.errors = errors;
        }
      });
  }

  getIsConfirmed() : boolean {
    return this.isConfirmed;
  }
}
