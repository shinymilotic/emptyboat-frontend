import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ProfileService } from "../../services/profile.service";
import { UserService } from "../../services/user.service";
import { Profile } from "../../models/auth/profile.model";
import { NgClass } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-follow-button",
  templateUrl: "./follow-button.component.html",
  styleUrls: ["./follow-button.component.css"],
  imports: [NgClass],
  standalone: true,
})
export class FollowButtonComponent implements OnInit {
  @Input() profile!: Profile;
  @Output() toggle = new EventEmitter<void>();
  isSubmitting = false;
  destroyRef: DestroyRef = inject(DestroyRef);
  following!: boolean;

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.following = this.profile?.following
  }

  toggleFollowing(): void {
    this.isSubmitting = true;

    if (!this.userService.userSignal()) {
        this.router.navigate(["/login"]);
    }

    this.toggleFollow(this.profile.following)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.following = !this.following;
          this.toggle.emit();
        },
        error: () => (this.isSubmitting = false),
      });
  }

  public toggleFollow(following: boolean): Observable<void> {
    if (!following) {
      return this.profileService.follow(this.profile.username);
    } else {
      return this.profileService.unfollow(this.profile.username);
    }
  }
}
