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
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Course' : 'Add Course' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Course Name</mat-label>
              <input matInput formControlName="courseName" placeholder="Enter course name">
              <mat-error *ngIf="courseForm.get('courseName')?.hasError('required')">Course name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Enter description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Credits</mat-label>
              <input matInput formControlName="credits" type="number" placeholder="Enter credits">
              <mat-error *ngIf="courseForm.get('credits')?.hasError('required')">Credits are required</mat-error>
              <mat-error *ngIf="courseForm.get('credits')?.hasError('min')">Minimum 1 credit</mat-error>
              <mat-error *ngIf="courseForm.get('credits')?.hasError('max')">Maximum 6 credits</mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="courseForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 10px; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
  `]
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
