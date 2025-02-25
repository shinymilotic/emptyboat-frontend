import { Component } from "@angular/core";
import { Article } from "../../../models/blog/article.model";
import { SearchParam } from "../../../models/search.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class SearchBarComponent {
  results: Article[] = [];
  
  searchInput: FormControl<string> = new FormControl('', { nonNullable: true });
  searchForm: FormGroup = this.fb.group({
    searchInput: this.searchInput
  }
    );
  searchReturned = false;
  searchParam: SearchParam | any;
  destroy$ = new Subject<void>();
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {}

  onSearch() {
    const searchInput :string = this.searchForm.get("searchInput")?.value;
    // this.router.navigate(["/search/articles"], {queryParams: {q: searchInput}}).then(() => {
    //   window.location.reload();
    // });;
    
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search/articles'], {queryParams: {q: searchInput}});
    }).catch((err) => {console.log(err)});
  }
}
