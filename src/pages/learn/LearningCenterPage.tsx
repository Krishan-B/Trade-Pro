import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData } from '@/hooks/useCourseData';
import { useEnrollmentData } from '@/hooks/useEnrollmentData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LearningCenterPage = () => {
  const { user } = useAuth();
  const { courses, isLoading: coursesLoading } = useCourseData(user?.id || '');
  const { enrollments, enrollInCourse, isLoading: enrollmentsLoading } = useEnrollmentData(user?.id || '');

  const handleEnroll = (courseId: string) => {
    enrollInCourse.mutate(courseId);
  };

  const isEnrolled = (courseId: string) => {
    return enrollments?.some(e => e.course_id === courseId);
  };

  if (coursesLoading || enrollmentsLoading) {
    return (
      <div className="p-4 md:p-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Learning Center</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map(course => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <Button onClick={() => handleEnroll(course.id!)} disabled={isEnrolled(course.id!)}>
                {isEnrolled(course.id!) ? 'Enrolled' : 'Enroll'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningCenterPage;