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
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiError } from 'src/app/models/apierrors.model';
import { ListErrorsComponent } from "../../../shared-components/list-errors/list-errors.component";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [TableModule, CommonModule, RouterModule, PaginatorModule, ImageModule, IconFieldModule, InputIconModule, InputTextModule, RouterLink, ListErrorsComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users!: User[];
  usersCount!: number;
  pageNumber: number = 0;
  itemsPerPage: number = 10;
  searchKeywords: string = '';
  error!: ApiError;

  constructor(
    private readonly userManageService: UserManageService,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    forkJoin([
      this.userManageService.getUsers(this.pageNumber, this.itemsPerPage),
      this.userManageService.getUsersCount()
      ]).subscribe({
        next: ([data, userCount]) => {
          this.users = data;
          this.usersCount = userCount;
        },
        error: (error: ApiError) => {
          this.error = error;
        }
      })
  }

  onPageChange($event: PaginatorState) {
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
      error: (error: ApiError) => {
        this.error = error;
      }
    });
  }

  deleteUser(userId: string) : void {
    this.userManageService.deleteUser(userId).subscribe({
      next: () => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['admin/user']);
      });
      },
      error: (error: ApiError) => {
        this.error = error;
      }
    })
  }
}
