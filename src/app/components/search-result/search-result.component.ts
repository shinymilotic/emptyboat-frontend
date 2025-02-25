import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingState } from 'src/app/models/loading-state.model';
import { SearchService } from 'src/app/services/search.service';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css'],
    standalone: true,
    imports: [
      RouterLink,
      RouterLinkActive,
      RouterOutlet
    ]
})
export class SearchResultComponent implements OnInit{
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  q: string = '';

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.q = params['q'];
    });
  }
}
