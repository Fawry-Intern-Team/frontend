import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../models';
import { AuthService } from '../../services';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { CartComponent } from '../../components/cart/cart.component';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule, AvatarModule, DrawerModule, ButtonModule, CartComponent, MenubarModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    console.log(user);
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
      this.userProfilePicture = user.photoURL || this.userProfilePicture;
      console.log(this.userProfilePicture);
      const first = user.firstName?.charAt(0) || '';
      const last = user.lastName?.charAt(0) || '';
      this.userInitials = first + last || this.userInitials;
  
      this.userName = `${user.firstName} ${user.lastName}`.trim() || this.userName;
    }
  }
  visible: boolean = false;
  isLoggedIn = false;
  user !: User;
  // User profile data - replace with actual user service data

  userProfilePicture!: string; // Replace with actual profile picture URL
  userInitials: string = 'JD'; // Fallback initials if no profile picture
  userName: string = 'John Doe'; // Replace with actual user name

  profileMenuItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      styleClass: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
      command: () => {
        this.viewProfile();
      }
    },
    {
      separator: true
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      styleClass: 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
      command: () => {
        this.viewSettings();
      }
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      styleClass: 'text-red-600 hover:bg-red-50',
      command: () => {
        this.logout();
      }
    }
  ];

  constructor(
    public cartService: CartService,
    private router: Router,
    private auth: AuthService
  ) {}

  navItems: MenuItem[] = [
    {
      label: 'Products',
      routerLink: '/products',
      icon: 'pi pi-tags'
    }
  ];
  
  

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  viewSettings(): void {
    this.router.navigate(['/settings']);
  }

  logout(): void {
    // Add your logout logic here
    // For example: clear tokens, redirect to login
    // console.log('Logging out...');
    
    // // Clear any stored authentication tokens
    // localStorage.removeItem('authToken');
    // // or sessionStorage.removeItem('authToken');
    
    // Redirect to login page
    this.router.navigate(['/logout']);
    
    // Optional: Show logout confirmation
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Logged Out',
    //   detail: 'You have been successfully logged out'
    // });
  }
}