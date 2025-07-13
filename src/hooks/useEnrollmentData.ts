import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "./useCourseData";

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  courses: Course;
}

export interface LessonProgress {
  id: string;
  enrollment_id: string;
  lesson_id: string;
  completed_at: string;
}

export const useEnrollmentData = (userId: string) => {
  const queryClient = useQueryClient();

  const fetchEnrollments = async (): Promise<Enrollment[]> => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', userId);
    if (error) throw new Error(error.message);
    return data;
  };

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments', userId],
    queryFn: fetchEnrollments,
    enabled: !!userId,
  });

  const enrollInCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({ student_id: userId, course_id: courseId })
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
    },
  });

  const markLessonComplete = useMutation({
    mutationFn: async ({ enrollmentId, lessonId }: { enrollmentId: string, lessonId: string }) => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({ enrollment_id: enrollmentId, lesson_id: lessonId, completed_at: new Date().toISOString() })
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
    },
  });

  return { enrollments, isLoading, enrollInCourse, markLessonComplete };
};