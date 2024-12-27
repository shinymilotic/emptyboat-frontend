import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { User } from './user.model';
import { UserManageService } from './user-manage.serivce';
import { RestResponse } from 'src/app/models/restresponse.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users!: User[];
  page: number = 1;
  size: number = 10;

  constructor(private readonly userManageService: UserManageService) {

  }

  ngOnInit(): void {
    this.userManageService.getUsers().subscribe({
      next: (data: RestResponse<User[]>) => {
        this.users = data.data;
        console.log(this.users);
      },
      error: () => {

      }
    });
  }

  onPageChange($event: TablePageEvent) {
    const page: number = $event.first/$event.rows + 1;
    // this.userManageService.getUsers(page, $event.rows).subscribe({
    //   next: (data: RestResponse<User[]>) => {
    //     this.users = data.data;
    //     console.log(this.users);
    //   },
    //   error: () => {

    //   }
    // });
  }
}
