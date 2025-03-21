import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TagService } from 'src/app/services/tags.service';
import { TagFollowing } from './tag-following.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {
  destroyRef: DestroyRef = inject(DestroyRef);
  tags: TagFollowing[] = [];

  constructor(private readonly tagService: TagService) {

  }
  
  ngOnInit(): void {
    this.tagService.getAll(true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.tags = data as TagFollowing[];
      });
  }

  followTag(tag: TagFollowing): void {
    this.tagService.followTag(tag.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.tags.forEach(item => {
          if (item.id === tag.id) {
            tag.following = true;
          }
        });
      });
  }

  unfollowTag(tag: TagFollowing): void {
    this.tagService.unfollowTag(tag.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.tags.forEach(item => {
          if (item.id === tag.id) {
            tag.following = false;
          }
        });
      });
  }
}
