import { Component, OnInit } from '@angular/core';
import { Tag } from 'src/app/models/blog/tag.model';
import { TagsService } from 'src/app/services/tags.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent implements OnInit{

  tags: Tag[] = [];

  constructor(private readonly tagService: TagsService) {

  }
  
  ngOnInit(): void {
    this.tagService.getAll().subscribe(({data}) => {
      this.tags = data;
    });
  }

  followTag(tag: Tag): void {
    
  }
}
