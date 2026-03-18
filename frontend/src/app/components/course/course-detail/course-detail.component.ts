import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container" *ngIf="course">
      <div class="header">
        <h2>{{ course.courseName }}</h2>
        <div>
          <button mat-raised-button color="primary" (click)="editCourse()">
            <mat-icon>edit</mat-icon> Edit
          </button>
          <button mat-raised-button (click)="goBack()">Back</button>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <p><strong>ID:</strong> {{ course.id }}</p>
          <p><strong>Course Name:</strong> {{ course.courseName }}</p>
          <p><strong>Description:</strong> {{ course.description || 'N/A' }}</p>
          <p><strong>Credits:</strong> {{ course.credits }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header div { display: flex; gap: 10px; }
  `]
})
export class CourseDetailComponent implements OnInit {
  course?: Course;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.courseService.getCourseById(id).subscribe(course => {
      this.course = course;
    });
  }

  editCourse(): void {
    this.router.navigate(['/courses', this.course?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
