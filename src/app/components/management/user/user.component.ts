import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from './user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users!: User[];

  ngOnInit(): void {
    
  }
}
