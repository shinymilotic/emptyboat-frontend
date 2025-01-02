import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { User } from './user.model';
import { UserManageService } from './user-manage.serivce';
import { RestResponse } from 'src/app/models/restresponse.model';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { GetUserResponse } from './get-user-response.mode';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule, PaginatorModule, ImageModule, IconFieldModule,InputIconModule, InputTextModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  data!: GetUserResponse;
  page: number = 1;
  size: number = 10;
  searchKeywords: string = '';

  constructor(private readonly userManageService: UserManageService) {

  }

  ngOnInit(): void {
    console.log("ngOnInit()");
    this.userManageService.getUsers(this.page, this.size).subscribe({
      next: (data: RestResponse<GetUserResponse>) => {
        this.data = data.data;
        console.log(this.data);
      },
      error: () => {

      }
    });
  }

  onPageChange($event: PaginatorState) {
    this.userManageService.getUsers($event.page, $event.rows).subscribe({
      next: (data: RestResponse<GetUserResponse>) => {
        this.data = data.data;
        if ($event.page != undefined) {
          this.page = $event.page;
        }

        if ($event.rows != undefined) {
          this.size = $event.rows;
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
