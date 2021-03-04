import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { AuthService } from "./auth/auth.service";

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
    public authService: AuthService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.setMenu([]);
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
    .subscribe((event) => {
      this.title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
    });
    this.authService.onMenuChange.subscribe(async (menu: any) => {
      this.setMenu(menu);
      this.treeControl.expandAll();
    });
    this.setMenu(this.authService.getMenu());
    this.treeControl.expandAll();
  }



  closeMenu(): void {
    this.snav && this.snav.toggle()
  }

  setMenu(menu) {
    this.dataSource.data = menu;
    this.treeControl.dataNodes = menu;  //Necessary for expandAll to work
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
