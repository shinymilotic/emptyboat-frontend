import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Profile } from "src/app/models/auth/profile.model";

@Injectable({ providedIn: "root" })
export class ProfileService {
  profile: WritableSignal<Profile | undefined> = signal(undefined);
  constructor() {}
}
