import { Course } from './course.model';

export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  courses?: Course[];
}
