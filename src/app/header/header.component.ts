import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAunthenticated = false;
  private authListernSubs: Subscription;

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userIsAunthenticated = this.authService.getIsAuth();
    this.authListernSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAunthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListernSubs.unsubscribe();
  }

}
