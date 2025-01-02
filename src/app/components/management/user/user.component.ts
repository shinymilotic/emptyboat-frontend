import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from './user.model';
import { UserManageService } from './user-manage.serivce';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule, PaginatorModule, ImageModule, IconFieldModule,InputIconModule, InputTextModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users!: User[];
  usersCount!: number;
  pageNumber: number = 0;
  itemsPerPage: number = 10;
  searchKeywords: string = '';

  constructor(private readonly userManageService: UserManageService) {

  }

  ngOnInit(): void {
    console.log("ngOnInit()");
    this.userManageService.getUsers(this.pageNumber, this.itemsPerPage).subscribe({
      next: (data: User[]) => {
        this.users = data;
        console.log(this.users);
      },
      error: () => {

      }
    });
    
    this.userManageService.getUsersCount().subscribe({
      next: (data: number) => {
        this.usersCount = data;
        console.log(data);
      },
      error: () => {

      }
    })
  }

  onPageChange($event: PaginatorState) {
    console.log($event);
    this.userManageService.getUsers($event.page, $event.rows).subscribe({
      next: (data: User[]) => {
        this.users = data;
        if ($event.page != undefined) {
          this.pageNumber = $event.page;
        }

        if ($event.rows != undefined) {
          this.pageNumber = $event.rows;
        }
        
      },
      error: () => {

      }
    });
  }

  searchKeyword(event: Event | null) : void {
    console.log(this.searchKeywords);
    // const inputEvent: InputEvent = event as InputEvent;
    // if (event?.target == null) {
    //   return;
    // }
    // // const value: string = event.v;
    // console.log((inputEvent.target as EventTarget));
  }
}
