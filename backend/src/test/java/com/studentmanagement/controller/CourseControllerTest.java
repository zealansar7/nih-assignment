package com.studentmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentmanagement.dto.CourseDTO;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    private ObjectMapper objectMapper;
    private CourseDTO courseDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        courseDTO = CourseDTO.builder()
                .id(1L)
                .courseName("Mathematics")
                .description("Advanced Math")
                .credits(4)
                .build();
    }

    @Test
    void getAllCourses_ShouldReturnList() throws Exception {
        when(courseService.getAllCourses()).thenReturn(List.of(courseDTO));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].courseName").value("Mathematics"));
    }

    @Test
    void getCourseById_ShouldReturnCourse() throws Exception {
        when(courseService.getCourseById(1L)).thenReturn(courseDTO);

        mockMvc.perform(get("/api/courses/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseName").value("Mathematics"));
    }

    @Test
    void getCourseById_NotFound_ShouldReturn404() throws Exception {
        when(courseService.getCourseById(99L)).thenThrow(new ResourceNotFoundException("Course not found"));

        mockMvc.perform(get("/api/courses/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createCourse_ShouldReturnCreated() throws Exception {
        when(courseService.createCourse(any(CourseDTO.class))).thenReturn(courseDTO);

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseName").value("Mathematics"));
    }

    @Test
    void createCourse_InvalidData_ShouldReturn400() throws Exception {
        CourseDTO invalid = CourseDTO.builder().courseName("").credits(null).build();

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateCourse_ShouldReturnUpdated() throws Exception {
        when(courseService.updateCourse(eq(1L), any(CourseDTO.class))).thenReturn(courseDTO);

        mockMvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDTO)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCourse_ShouldReturnNoContent() throws Exception {
        doNothing().when(courseService).deleteCourse(1L);

        mockMvc.perform(delete("/api/courses/1"))
                .andExpect(status().isNoContent());
    }
}
