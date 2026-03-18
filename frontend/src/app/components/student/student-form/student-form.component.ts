import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Student' : 'Add Student' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter first name">
              <mat-error *ngIf="studentForm.get('firstName')?.hasError('required')">First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter last name">
              <mat-error *ngIf="studentForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter email" type="email">
              <mat-error *ngIf="studentForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="studentForm.get('email')?.hasError('email')">Invalid email format</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date of Birth</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dateOfBirth" placeholder="Select date">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="studentForm.invalid">
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
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode = false;
  studentId?: number;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.studentId = +id;
      this.studentService.getStudentById(this.studentId).subscribe(student => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : ''
        });
      });
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    const formValue = this.studentForm.value;
    const student = {
      ...formValue,
      dateOfBirth: formValue.dateOfBirth
        ? new Date(formValue.dateOfBirth).toISOString().split('T')[0]
        : null
    };

    if (this.isEditMode && this.studentId) {
      this.studentService.updateStudent(this.studentId, student).subscribe({
        next: () => {
          this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/students']);
        },
        error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
      });
    } else {
      this.studentService.createStudent(student).subscribe({
        next: () => {
          this.snackBar.open('Student created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/students']);
        },
        error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
