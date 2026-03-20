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
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
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
