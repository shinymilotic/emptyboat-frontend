import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { UserPractice } from "src/app/models/test/user-practices.model";
import { PracticeService } from "src/app/services/practice.service";

@Component({
  selector: "app-user-practice",
  templateUrl: "./user-practice.component.html",
  styleUrls: ["./user-practice.component.css"],
  imports: [RouterLink],
  standalone: true,
})
export class UserPracticeComponent implements OnInit {
  practices: UserPractice[] = [];
  practiceMap: Map<string, UserPractice[]> = new Map();
  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly practiceService: PracticeService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const username = this.getUsername();
    this.practiceService.getPractices(username)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        data.forEach(practice => {
          const [day, month, year] = practice.date.split(/[- :]/);
          const date = day + '/' + month + '/' + year;
          if (this.practiceMap.has(date)) {
            this.practiceMap.get(date)?.push(practice);
          } else {
            this.practiceMap.set(date, [practice]);
          }
        });
        this.practices = data; 
      });
  }

  getTime(dateStr: string) {
    const date = dateStr.split(/[- :]/);
    return date[3] + ":" + date[4];
  }

  getUsername(): string {
    return this.route.parent?.snapshot.params["username"];
  }
}
