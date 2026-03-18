import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/students';
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadStudents(): void {
    this.http.get<Student[]>(this.apiUrl).subscribe(students => {
      this.studentsSubject.next(students);
    });
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl).pipe(
      tap(students => this.studentsSubject.next(students))
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student).pipe(
      tap(() => this.loadStudents())
    );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student).pipe(
      tap(() => this.loadStudents())
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadStudents())
    );
  }

  enrollInCourse(studentId: number, courseId: number): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${studentId}/enroll/${courseId}`, {}).pipe(
      tap(() => this.loadStudents())
    );
  }

  unenrollFromCourse(studentId: number, courseId: number): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/${studentId}/unenroll/${courseId}`).pipe(
      tap(() => this.loadStudents())
    );
  }
}
