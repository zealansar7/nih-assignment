package com.studentmanagement.service;

import com.studentmanagement.dto.StudentDTO;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.model.Course;
import com.studentmanagement.model.Student;
import com.studentmanagement.repository.CourseRepository;
import com.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private StudentService studentService;

    private Student student;
    private StudentDTO studentDTO;
    private Course course;

    @BeforeEach
    void setUp() {
        student = Student.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .courses(new HashSet<>())
                .build();

        studentDTO = StudentDTO.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .dateOfBirth(LocalDate.of(2000, 1, 1))
                .build();

        course = Course.builder()
                .id(1L)
                .courseName("Math")
                .description("Mathematics")
                .credits(3)
                .students(new HashSet<>())
                .build();
    }

    @Test
    void getAllStudents_ShouldReturnList() {
        when(studentRepository.findAll()).thenReturn(List.of(student));
        List<StudentDTO> result = studentService.getAllStudents();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    void getStudentById_WhenExists_ShouldReturn() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        StudentDTO result = studentService.getStudentById(1L);
        assertThat(result.getEmail()).isEqualTo("john@example.com");
    }

    @Test
    void getStudentById_WhenNotExists_ShouldThrow() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> studentService.getStudentById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createStudent_ShouldSaveAndReturn() {
        when(studentRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.createStudent(studentDTO);
        assertThat(result.getFirstName()).isEqualTo("John");
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void createStudent_DuplicateEmail_ShouldThrow() {
        when(studentRepository.existsByEmail("john@example.com")).thenReturn(true);
        assertThatThrownBy(() -> studentService.createStudent(studentDTO))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void updateStudent_ShouldUpdateAndReturn() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.findByEmail("john@example.com")).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO updated = studentService.updateStudent(1L, studentDTO);
        assertThat(updated.getFirstName()).isEqualTo("John");
    }

    @Test
    void deleteStudent_WhenExists_ShouldDelete() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        studentService.deleteStudent(1L);
        verify(studentRepository).delete(student);
    }

    @Test
    void deleteStudent_WhenNotExists_ShouldThrow() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> studentService.deleteStudent(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void enrollStudentInCourse_ShouldAddCourse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        studentService.enrollStudentInCourse(1L, 1L);
        assertThat(student.getCourses()).contains(course);
    }

    @Test
    void unenrollStudentFromCourse_ShouldRemoveCourse() {
        student.getCourses().add(course);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        studentService.unenrollStudentFromCourse(1L, 1L);
        assertThat(student.getCourses()).doesNotContain(course);
    }
}
