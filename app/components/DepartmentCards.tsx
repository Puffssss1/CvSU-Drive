'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Department {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

function FolderList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error);
      } else {
        setDepartments(data || []);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch courses for the selected department
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedDepartment) return;

      const { data, error } = await supabase
        .from('courses')
        .select('id, name')
        .eq('department_id', selectedDepartment) // Fetch courses related to the selected department
        .order('name', { ascending: true });

      if (error) {
        console.error(`Error fetching courses for department ${selectedDepartment}:`, error);
      } else {
        setCourses(data || []);
      }
    };

    fetchCourses();
  }, [selectedDepartment]);

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: 'list' | 'grid' | null) => {
    if (newLayout) setLayout(newLayout);
  };

  const handleDepartmentClick = (departmentId: string) => {
    setSelectedDepartment(departmentId); // Set selected department
    setCourses([]); // Clear existing courses when a new department is selected
  };

  return (
    <div className="ml-[220px]">
      <Box sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">{selectedDepartment ? 'Courses' : 'Departments'}</Typography>
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}
            aria-label="layout toggle"
          >
            <ToggleButton value="grid" aria-label="grid layout">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list layout">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Display departments as folders */}
        {!selectedDepartment ? (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {departments.map((department) => (
              <Box key={department.id} width="300px" mb={2} position="relative">
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    boxShadow: 3,
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleDepartmentClick(department.id)} // Set the department when clicked
                >
                  <Box
                    sx={{
                      backgroundColor: '#e0e0e0',
                      height: '150px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      {department.name}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {department.name}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          // Display courses for the selected department
          <Box display="flex" flexWrap="wrap" gap={2}>
            {courses.map((course) => (
              <Box key={course.id} width="300px" mb={2} position="relative">
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    boxShadow: 3,
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#e0e0e0',
                      height: '150px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      {course.name}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {course.name}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default FolderList;
