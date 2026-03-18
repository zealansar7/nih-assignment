import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Students</h2>
        <button mat-raised-button color="primary" (click)="addStudent()">
          <mat-icon>add</mat-icon> Add Student
        </button>
      </div>

      <table mat-table [dataSource]="students" class="mat-elevation-z4 full-width">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let s">{{ s.id }}</td>
        </ng-container>

        <ng-container matColumnDef="firstName">
          <th mat-header-cell *matHeaderCellDef>First Name</th>
          <td mat-cell *matCellDef="let s">{{ s.firstName }}</td>
        </ng-container>

        <ng-container matColumnDef="lastName">
          <th mat-header-cell *matHeaderCellDef>Last Name</th>
          <td mat-cell *matCellDef="let s">{{ s.lastName }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let s">{{ s.email }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let s">
            <button mat-icon-button color="primary" (click)="viewStudent(s.id)" title="View">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="editStudent(s.id)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="confirmDelete(s)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <p *ngIf="students.length === 0" class="no-data">No students found.</p>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .full-width { width: 100%; }
    .no-data { text-align: center; padding: 20px; color: #888; }
  `]
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'actions'];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.studentService.students$.subscribe(students => {
      this.students = students;
    });
    this.studentService.loadStudents();
  }

  addStudent(): void {
    this.router.navigate(['/students/new']);
  }

  viewStudent(id: number): void {
    this.router.navigate(['/students', id]);
  }

  editStudent(id: number): void {
    this.router.navigate(['/students', id, 'edit']);
  }

  confirmDelete(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Student',
        message: `Are you sure you want to delete ${student.firstName} ${student.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && student.id) {
        this.studentService.deleteStudent(student.id).subscribe({
          next: () => this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 }),
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 })
        });
      }
    });
  }
}
