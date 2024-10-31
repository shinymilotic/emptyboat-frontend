import { Component, OnInit } from '@angular/core';
import { TagsService } from 'src/app/services/tags.service';
import { TagFollowing } from './tag-following.model';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit {

  tags: TagFollowing[] = [];

  constructor(private readonly tagService: TagsService) {

  }
  
  ngOnInit(): void {
    this.tagService.getAll().subscribe(({data}) => {
      this.tags = data as TagFollowing[];
    });
  }

  followTag(tag: TagFollowing): void {
    this.tagService.followTag(tag.id).subscribe();
  }
}
