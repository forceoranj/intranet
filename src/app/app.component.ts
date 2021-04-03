import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import * as _ from 'lodash-es';
import { MenuService } from "./services/menu.service";
import { CrudService } from './services/crud.service';
import { Menus } from './classes/menu';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  @ViewChild('snav') snav;

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private router: Router,
    public menuService: MenuService,
    public crudService: CrudService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.setMenus([]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router)
    )
    .subscribe(async (event) => {
      this.title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');

      const user = await this.crudService.getUser();
      const menus = await this.menuService.getMenus(user);
      this.updateMenus(menus);
    });

    this.menuService.onChange.subscribe(async (asyncMenus: Promise<Menus>) => {
      const menus = await asyncMenus;
      this.updateMenus(menus);
    });
  }



  updateMenus(menus: Menus): void {
    this.setMenus(menus);
    if (_.isEmpty(menus)) {
      this.closeMenu();
    }
    else {
      this.treeControl.expandAll();
    }
  }



  closeMenu(): void {
    this.snav && this.snav.close()
  }

  setMenus(menus: Menus) {
    this.dataSource.data = menus;
    this.treeControl.dataNodes = menus;  //Necessary for expandAll to work
  }

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  get currentPath(): string {
    return window.location.pathname;
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

}
