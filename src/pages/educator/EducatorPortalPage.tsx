import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCourseData, Course } from '@/hooks/useCourseData';
import CourseList from '@/features/educator/components/CourseList';
import CourseForm from '@/features/educator/components/CourseForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EducatorPortalPage = () => {
  const { user } = useAuth();
  const { courses, isLoading, createCourse, updateCourse, deleteCourse } = useCourseData(user?.id || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);

  const handleCreate = () => {
    setEditingCourse(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDelete = (courseId: string) => {
    deleteCourse.mutate(courseId);
  };

  const handleSubmit = (data: Omit<Course, 'id' | 'educator_id'>) => {
    if (editingCourse) {
      updateCourse.mutate({ ...data, id: editingCourse.id, educator_id: user!.id });
    } else {
      createCourse.mutate({ ...data, educator_id: user!.id });
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Educator Portal</h1>
        <Button onClick={handleCreate}>Create Course</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseList courses={courses || []} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</DialogTitle>
          </DialogHeader>
          <CourseForm
            course={editingCourse}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducatorPortalPage;