import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    standalone: true,
    imports: [
        FollowButtonComponent,
        RouterLink,
        AsyncPipe,
        RouterLinkActive,
        RouterOutlet,
    ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile!: Profile;
  isUser: boolean = false;
  destroy$ = new Subject<void>();

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
      )
      .subscribe((profile) => {
        this.profile = profile.data;
        this.isUser = profile.data.username === this.userService.userSignal()?.username;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // onToggleFollowing(profile: Profile) {
  //   this.profile = profile;
  // }
}
