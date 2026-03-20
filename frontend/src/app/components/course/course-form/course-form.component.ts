import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = false;
  courseId?: number;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      description: [''],
      credits: ['', [Validators.required, Validators.min(1), Validators.max(6)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.courseId = +id;
      this.courseService.getCourseById(this.courseId).subscribe(course => {
        this.courseForm.patchValue(course);
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    const course = this.courseForm.value;

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, course).subscribe({
        next: () => {
          this.snackBar.open('Course updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/courses']);
        },
        error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
      });
    } else {
      this.courseService.createCourse(course).subscribe({
        next: () => {
          this.snackBar.open('Course created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/courses']);
        },
        error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
