package com.studentmanagement.service;

import com.studentmanagement.dto.CourseDTO;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.model.Course;
import com.studentmanagement.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course course;
    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        course = Course.builder()
                .id(1L)
                .courseName("Mathematics")
                .description("Advanced Math")
                .credits(4)
                .students(new HashSet<>())
                .build();

        courseDTO = CourseDTO.builder()
                .courseName("Mathematics")
                .description("Advanced Math")
                .credits(4)
                .build();
    }

    @Test
    void getAllCourses_ShouldReturnList() {
        when(courseRepository.findAll()).thenReturn(List.of(course));
        List<CourseDTO> result = courseService.getAllCourses();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCourseName()).isEqualTo("Mathematics");
    }

    @Test
    void getCourseById_WhenExists_ShouldReturn() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        CourseDTO result = courseService.getCourseById(1L);
        assertThat(result.getCourseName()).isEqualTo("Mathematics");
    }

    @Test
    void getCourseById_WhenNotExists_ShouldThrow() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> courseService.getCourseById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createCourse_ShouldSaveAndReturn() {
        when(courseRepository.existsByCourseName("Mathematics")).thenReturn(false);
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.createCourse(courseDTO);
        assertThat(result.getCourseName()).isEqualTo("Mathematics");
        verify(courseRepository).save(any(Course.class));
    }

    @Test
    void createCourse_DuplicateName_ShouldThrow() {
        when(courseRepository.existsByCourseName("Mathematics")).thenReturn(true);
        assertThatThrownBy(() -> courseService.createCourse(courseDTO))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void updateCourse_ShouldUpdateAndReturn() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseDTO result = courseService.updateCourse(1L, courseDTO);
        assertThat(result.getCourseName()).isEqualTo("Mathematics");
    }

    @Test
    void updateCourse_WhenNotExists_ShouldThrow() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> courseService.updateCourse(99L, courseDTO))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteCourse_WhenExists_ShouldDelete() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        courseService.deleteCourse(1L);
        verify(courseRepository).delete(course);
    }

    @Test
    void deleteCourse_WhenNotExists_ShouldThrow() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> courseService.deleteCourse(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
