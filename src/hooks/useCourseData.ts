import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id?: string;
  educator_id: string;
  title: string;
  description: string;
}

export const useCourseData = (userId: string) => {
  const queryClient = useQueryClient();

  const fetchCourses = async (): Promise<Course[]> => {
    const { data, error } = await supabase.functions.invoke('course-management', {
      body: { endpoint: 'courses' },
      method: 'GET',
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', userId],
    queryFn: fetchCourses,
    enabled: !!userId,
  });

  const createCourse = useMutation({
    mutationFn: async (newCourse: Course) => {
      const { data, error } = await supabase.functions.invoke('course-management', {
        body: { endpoint: 'courses', course: newCourse },
        method: 'POST',
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', userId] });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async (updatedCourse: Course) => {
      const { data, error } = await supabase.functions.invoke('course-management', {
        body: { endpoint: 'courses', course: updatedCourse },
        method: 'PUT',
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', userId] });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.functions.invoke('course-management', {
        body: { endpoint: 'courses', id: courseId },
        method: 'DELETE',
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', userId] });
    },
  });

  return { courses, isLoading, createCourse, updateCourse, deleteCourse };
};