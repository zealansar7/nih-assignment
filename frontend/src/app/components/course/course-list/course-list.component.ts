import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Courses</h2>
        <button mat-raised-button color="primary" (click)="addCourse()">
          <mat-icon>add</mat-icon> Add Course
        </button>
      </div>

      <table mat-table [dataSource]="courses" class="mat-elevation-z4 full-width">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let c">{{ c.id }}</td>
        </ng-container>

        <ng-container matColumnDef="courseName">
          <th mat-header-cell *matHeaderCellDef>Course Name</th>
          <td mat-cell *matCellDef="let c">{{ c.courseName }}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let c">{{ c.description }}</td>
        </ng-container>

        <ng-container matColumnDef="credits">
          <th mat-header-cell *matHeaderCellDef>Credits</th>
          <td mat-cell *matCellDef="let c">{{ c.credits }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let c">
            <button mat-icon-button color="primary" (click)="viewCourse(c.id)" title="View">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="editCourse(c.id)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="confirmDelete(c)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <p *ngIf="courses.length === 0" class="no-data">No courses found.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .full-width { width: 100%; }
    .no-data { text-align: center; padding: 20px; color: #888; }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  displayedColumns = ['id', 'courseName', 'description', 'credits', 'actions'];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.courseService.courses$.subscribe(courses => {
      this.courses = courses;
    });
    this.courseService.loadCourses();
  }

  addCourse(): void {
    this.router.navigate(['/courses/new']);
  }

  viewCourse(id: number): void {
    this.router.navigate(['/courses', id]);
  }

  editCourse(id: number): void {
    this.router.navigate(['/courses', id, 'edit']);
  }

  confirmDelete(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete ${course.courseName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && course.id) {
        this.courseService.deleteCourse(course.id).subscribe({
          next: () => this.snackBar.open('Course deleted successfully', 'Close', { duration: 3000 }),
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
        });
      }
    });
  }
}
