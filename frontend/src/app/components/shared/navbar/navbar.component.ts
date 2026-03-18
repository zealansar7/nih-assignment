import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Student Management</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/students" routerLinkActive="active">Students</a>
      <a mat-button routerLink="/courses" routerLinkActive="active">Courses</a>
    </mat-toolbar>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .active { background: rgba(255,255,255,0.15); }
    a { text-decoration: none; }
  `]
})
export class NavbarComponent {}
