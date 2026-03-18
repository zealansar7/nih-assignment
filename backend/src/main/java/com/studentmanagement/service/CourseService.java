package com.studentmanagement.service;

import com.studentmanagement.dto.CourseDTO;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.model.Course;
import com.studentmanagement.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return toDTO(course);
    }

    @Transactional
    public CourseDTO createCourse(CourseDTO courseDTO) {
        if (courseRepository.existsByCourseName(courseDTO.getCourseName())) {
            throw new DuplicateResourceException("Course already exists with name: " + courseDTO.getCourseName());
        }
        Course course = toEntity(courseDTO);
        Course saved = courseRepository.save(course);
        return toDTO(saved);
    }

    @Transactional
    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.setCourseName(courseDTO.getCourseName());
        course.setDescription(courseDTO.getDescription());
        course.setCredits(courseDTO.getCredits());
        Course updated = courseRepository.save(course);
        return toDTO(updated);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        course.getStudents().forEach(student -> student.getCourses().remove(course));
        courseRepository.delete(course);
    }

    public CourseDTO toDTO(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .credits(course.getCredits())
                .build();
    }

    private Course toEntity(CourseDTO dto) {
        return Course.builder()
                .courseName(dto.getCourseName())
                .description(dto.getDescription())
                .credits(dto.getCredits())
                .build();
    }
}
