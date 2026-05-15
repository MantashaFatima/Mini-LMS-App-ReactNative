import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { NotificationService } from '../services/notifications';
import { Course, Instructor } from '../types';

interface CourseContextType {
  courses: Course[];
  instructors: Instructor[];
  isLoading: boolean;
  error: string | null;
  refreshCourses: () => Promise<void>;
  toggleBookmark: (courseId: number) => Promise<void>;
  searchCourses: (query: string) => Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const COURSES_KEY = 'courses';

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cached = await AsyncStorage.getItem(COURSES_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setCourses(parsed);
      }
      const [coursesData, instructorsData] = await Promise.all([
        api.getCourses(),
        api.getInstructors(),
      ]);
      const merged = coursesData.map(course => {
        const instructor = instructorsData.find(i => i.id === course.instructorId);

        return {
          ...course,
          instructor,
          isBookmarked: false,
        };
      });
      setCourses(merged);
      setInstructors(instructorsData);

      await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(merged));
    } catch (err) {
      setError('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCourses = useCallback(async () => {
    await loadData();
  }, []);

  const toggleBookmark = useCallback(async (courseId: number) => {
    try {
      let updatedBookmarkCount = 0;

      setCourses(prev => {
        const updated = prev.map(course =>
          course.id === courseId
            ? { ...course, isBookmarked: !course.isBookmarked }
            : course
        );

        updatedBookmarkCount = updated.filter(c => c.isBookmarked).length;
        AsyncStorage.setItem(COURSES_KEY, JSON.stringify(updated));
        return updated;
      });
      await NotificationService.checkAndSendBookmarkNotification(updatedBookmarkCount);

    } catch (err) {
      console.log('❌ Bookmark error:', err);
    }
  }, []);

  const searchCourses = useCallback(
    (query: string) => {
      if (!query.trim()) {
        return courses;
      }
      const q = query.toLowerCase();

      const filtered = courses.filter(course =>
        course.title?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        course.category?.toLowerCase().includes(q) ||
        course.instructor?.name?.toLowerCase().includes(q)
      );
      return filtered;
    },
    [courses]
  );

  return (
    <CourseContext.Provider
      value={{
        courses,
        instructors,
        isLoading,
        error,
        refreshCourses,
        toggleBookmark,
        searchCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourses must be used within CourseProvider');
  return context;
};