import { ChangeDetectorRef, Component, DestroyRef, HostBinding, inject, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { MenuService } from './app.menu.service';
import { LayoutService } from './service/app.layout.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    template: `
		<ng-container>
            @if (root && item.visible !== false) {
                <div  class="layout-menuitem-root-text">{{item.label}}</div>
            }
            @if ((!item.routerLink || item.items) && item.visible !== false) {
                <a  [attr.href]="item.url" (click)="itemClick($event)"
			   [class]="item.class" [attr.target]="item.target" tabindex="0" pRipple>
				<i [class]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
                @if (item.items) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>

                }
			    </a>
            }
			
            @if ((item.routerLink && !item.items) && item.visible !== false) {
                <a 
			   [routerLink]="item.routerLink" routerLinkActive="active-route" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
               [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" 
               [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" [queryParams]="item.queryParams"
               [attr.target]="item.target" tabindex="0" pRipple>
				<i [class]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
                @if(item.items) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler" ></i>
                }
			</a>
            }
			

            @if (item.items && item.visible !== false) {
                <ul>
                    <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                        <li app-menuitem class="menuItem" [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
                    </ng-template>
			    </ul>
            }
			
		</ng-container>
    `,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    imports: [
        SidebarModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        FormsModule,
        // BrowserModule,
        FormsModule,
        NgFor,
        NgForOf
    ],
    styleUrl: './app.menu.component.scss',
    standalone: true
})
export class AppMenuitemComponent implements OnInit {
    @Input() item: any;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;
    active = false;
    key: string = "";
    destroyRef: DestroyRef = inject(DestroyRef);

    constructor(public layoutService: LayoutService, private cd: ChangeDetectorRef, public router: Router, private menuService: MenuService) {
        this.menuService.menuSource$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                Promise.resolve(null).then(() => {
                    if (value.routeEvent) {
                        this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                    }
                    else {
                        if (value.key !== this.key && !value.key.startsWith(this.key + '-')) {
                            this.active = false;
                        }
                    }
                });
            });

        this.menuService.resetSource$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.active = false;
            });

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(params => {
                if (this.item.routerLink) {
                    this.updateActiveStateFromRoute();
                }
            });
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
    }

    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
        }
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
        }

        this.menuService.onMenuStateChange({ key: this.key });
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    @HostBinding('class.active-menuitem') 
    get activeClass() {
        return this.active && !this.root;
    }
}
