import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Profile } from "../../../models/auth/profile.model";
import { ProfileService } from "../../../services/profile.service";
import { FollowButtonComponent } from "../../../shared-components/buttons/follow-button.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    standalone: true,
    imports: [
        FollowButtonComponent,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
    ]
})
export class ProfileComponent implements OnInit {
  profile!: Profile;
  isUser: boolean = false;
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(
        catchError((error) => {
          void this.router.navigate(["/"]);
          return throwError(() => error);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((profile) => {
        this.profile = profile;
        this.profileService.profile.set(profile);
      });
  }

  isCurrentUser() {
    if (this.profile) {
      return this.profile.username === this.userService.userSignal()?.username;
    }

    return false;
  }

  // onToggleFollowing(profile: Profile) {
  //   this.profile = profile;
  // }
}
