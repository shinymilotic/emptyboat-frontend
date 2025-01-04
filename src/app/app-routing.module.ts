import { inject, NgModule } from "@angular/core";
import {
  Routes,
  RouterModule,
  UrlSegment,
} from "@angular/router";
import { UserService } from "./services/user.service";
import { ProfileComponent } from "./components/profile/show-profile/profile.component";
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
import { LayoutComponent } from "./layout/layout.component";
import { AuthGuard } from "./auth-guard";

export const routes: Routes = [
  {
    path: "register",
    loadComponent: () =>
      import("./components/user/register/register.component").then(
        (m) => m.RegisterComponent
      ),
    canActivate: [
      () => !inject(UserService).userSignal(),
    ],
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/user/login/login.component").then(
        (m) => m.LoginComponent
      ),
    canActivate: [
      () => !inject(UserService).userSignal(),
    ],
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "admin/user",
        loadComponent: () =>
          import("./components/management/user/user.component").then((m) => m.UserComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "admin/user/create",
        loadComponent: () =>
          import("./components/management/user/create-user/create-user.component").then((m) => m.CreateUserComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "admin/user/:username/update",
        loadComponent: () =>
          import("./components/management/user/update-user/update-user.component").then((m) => m.UpdateUserComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "admin/tag",
        loadComponent: () =>
          import("./components/management/tag/tag.component").then((m) => m.TagComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "admin/article",
        loadComponent: () =>
          import("./components/management/article/article.component").then((m) => m.ArticleComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "admin/test",
        loadComponent: () =>
          import("./components/management/test/test.component").then((m) => m.TestComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "",
        loadComponent: () =>
          import("./components/home/home.component").then((m) => m.HomeComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "tests",
        loadComponent: () =>
          import("./components/test/test-list/test-list.component").then(
            (m) => m.TestListComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "practice/:id",
        loadComponent: () =>
          import("./components/test/practice-test/test.component").then(
            (m) => m.TestComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "test/create",
        loadComponent: () =>
          import("./components/test/create-test/create-test.component").then(
            (m) => m.CreateTestComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "test/:id/update",
        loadComponent: () =>
          import("./components/test/update-test/update-test.component").then(
            (m) => m.UpdateTestComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./components/settings/settings.component").then(
            (m) => m.SettingsComponent
          ),
        canActivate: [() => inject(UserService).userSignal()],
      },
      {
        path: "editor",
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./components/editor/editor.component").then(
                (m) => m.EditorComponent
              ),
            canActivate: [() => inject(UserService).userSignal()],
          },
          {
            path: ":id",
            loadComponent: () =>
              import("./components/editor/editor.component").then(
                (m) => m.EditorComponent
              ),
            canActivate: [() => inject(UserService).userSignal()],
          },
        ],
      },
      {
        path: "articles/:id",
        loadComponent: () =>
          import("./components/article/article.component").then(
            (m) => m.ArticleComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "search",
        loadComponent: () =>
          import("./components/search-result/search-result.component").then(
            (m) => m.SearchResultComponent
          ),
        children: [
          {
            path: "articles",
            loadComponent: () =>
              import("./components/search-result/search-articles/search-articles.component").then(
                (m) => m.SearchArticlesComponent
              ),
            canActivate: [
              () => inject(AuthGuard).canActivate(),
            ],          
          },
          {
            path: "users",
            loadComponent: () =>
              import("./components/search-result/search-users/search-users.component").then(
                (m) => m.SearchUsersComponent
              ),
              canActivate: [
                () => inject(AuthGuard).canActivate(),
              ],
          },
          {
            path: "tests",
            loadComponent: () =>
              import("./components/search-result/search-tests/search-tests.component").then(
                (m) => m.SearchTestsComponent
              ),
              canActivate: [
                () => inject(AuthGuard).canActivate(),
              ],
          }
        ]
      },
      {
        path: "confirmEmail/:token",
        loadComponent: () =>
          import("./components/user/confirm-email/confirm-email.component").then(
            (m) => m.ConfirmEmailComponent
          ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        path: "tags",
        loadComponent: () =>
              import("./components/tags/tags.component").then(
                (m) => m.TagsComponent
              ),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      },
      {
        matcher: (url) => {
          const username: string = url[0].path;
          if (url.length === 1 && username.match(/^@[\w]+$/gm)) {
            return {
              consumed: url,
              posParams: { username: new UrlSegment(username.slice(1), {}) },
            };
          } else if (
            url.length === 2 &&
            username.match(/^@[\w]+$/gm) &&
            (url[1].path.match("favorites") || url[1].path.match("practices") || url[1].path.match("tests"))
          ) {
            return {
              consumed: url.slice(0, 1),
              posParams: { username: new UrlSegment(username.slice(1), {}) },
            };
          }
          return null;
        },
        component: ProfileComponent,
        children: [
          {
            path: "",
            loadComponent: () =>
              import(
                "./components/profile/profile-articles/profile-articles.component"
              ).then((m) => m.ProfileArticlesComponent),
            canActivate: [
              () => inject(AuthGuard).canActivate(),
            ],
          },
          {
            path: "favorites",
            loadComponent: () =>
              import(
                "./components/profile/profile-favorites/profile-favorites.component"
              ).then((m) => m.ProfileFavoritesComponent),
            canActivate: [
              () => inject(AuthGuard).canActivate(),
            ],
          },
          {
            path: "practices",
            loadComponent: () =>
              import(
                "./components/profile/user-practice/user-practice.component"
              ).then((m) => m.UserPracticeComponent),
            canActivate: [
              () => inject(AuthGuard).canActivate(),
            ],
          },
          {
            path: "tests",
            loadComponent: () =>
              import(
                "./components/profile/test-create/test-create.component"
              ).then((m) => m.TestCreateComponent),
            canActivate: [
              () => inject(AuthGuard).canActivate(),
            ],
          },
        ],
      },
      {
        matcher: (url) => {
          const username: string = url[0].path;
          const id: string = url[2].path;
          if (
            url.length === 3 &&
            username.match(/^@[\w]+$/gm) &&
            url[1].path.match("practices")
          ) {
            return {
              consumed: url,
              posParams: {
                username: new UrlSegment(username.slice(1), {}),
                id: new UrlSegment(id, {}),
              },
            };
          }
          return null;
        },
        loadComponent: () =>
          import(
            "./components/profile/practice-result/practice-result.component"
          ).then((m) => m.PracticeResultComponent),
        canActivate: [
          () => inject(AuthGuard).canActivate(),
        ],
      }
    ]
  },
  
  
  
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: QuicklinkStrategy,
      // PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
