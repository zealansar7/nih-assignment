import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../../services/student.service';
import { CourseService } from '../../../services/course.service';
import { Student } from '../../../models/student.model';
import { Course } from '../../../models/course.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTabsModule, MatButtonModule, MatIconModule,
    MatListModule, MatSelectModule, MatFormFieldModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {
  student?: Student;
  allCourses: Course[] = [];
  availableCourses: Course[] = [];
  selectedCourseId?: number;

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadStudent(id);
    this.courseService.getCourses().subscribe(courses => {
      this.allCourses = courses;
      this.updateAvailableCourses();
    });
  }

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe(student => {
      this.student = student;
      this.updateAvailableCourses();
    });
  }

  updateAvailableCourses(): void {
    if (!this.student?.courses) {
      this.availableCourses = this.allCourses;
      return;
    }
    const enrolledIds = new Set(this.student.courses.map(c => c.id));
    this.availableCourses = this.allCourses.filter(c => !enrolledIds.has(c.id));
  }

  enrollInCourse(): void {
    if (!this.student?.id || !this.selectedCourseId) return;
    this.studentService.enrollInCourse(this.student.id, this.selectedCourseId).subscribe({
      next: (student) => {
        this.student = student;
        this.selectedCourseId = undefined;
        this.updateAvailableCourses();
        this.snackBar.open('Enrolled successfully', 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
    });
  }

  confirmUnenroll(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Unenroll from Course',
        message: `Are you sure you want to unenroll from ${course.courseName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.student?.id && course.id) {
        this.studentService.unenrollFromCourse(this.student.id, course.id).subscribe({
          next: (student) => {
            this.student = student;
            this.updateAvailableCourses();
            this.snackBar.open('Unenrolled successfully', 'Close', { duration: 3000 });
          },
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
        });
      }
    });
  }

  editStudent(): void {
    this.router.navigate(['/students', this.student?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
