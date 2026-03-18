import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentDetailComponent } from './components/student/student-detail/student-detail.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseFormComponent } from './components/course/course-form/course-form.component';
import { CourseDetailComponent } from './components/course/course-detail/course-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/:id', component: StudentDetailComponent },
  { path: 'students/:id/edit', component: StudentFormComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/new', component: CourseFormComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'courses/:id/edit', component: CourseFormComponent },
];
