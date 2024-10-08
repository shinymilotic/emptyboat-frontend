import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { UserService } from "../services/user.service";

@Directive({
  selector: "[appShowAuthed]",
  standalone: true,
})
export class ShowAuthedDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef
  ) {}

  condition: boolean = false;

  ngOnInit() {
    if (
      (this.userService.userSignal() && this.condition) ||
      (!this.userService.userSignal() && !this.condition)) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }
}
