import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    private currentUser: User = {
        id: 0,
        username: '',
        secondname: '',
        phone: '',
        email: '',
        password: '',
        token: '',
        remember: false,
        products: []
    };
    constructor(
      private httpUserService: UserService,
      private authService: AuthenticationService,
      private activeRoute: ActivatedRoute,
      private router: Router
    ) { }
    ngOnInit() {
        this.httpUserService.getUserById(+this.activeRoute.snapshot.params.id).subscribe((user: User) => {
            this.currentUser = user;
        }, err => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (err === 'User not found') {
                this.router.navigate(['/not-found']);
            }
            if (err === 'Not access') {
                this.router.navigate([`/users/${currentUser.id}`]);
                this.currentUser = currentUser;
            }
        });
    }
    public toEditProfile() {
        this.router.navigate([`/users/${this.httpUserService.getLocalUser().id}/edit`]);
    }
    public logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
    get listProducts() {
        return this.httpUserService.getLocalUser().products;
    }
}
