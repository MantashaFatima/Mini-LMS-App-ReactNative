import { Course, Instructor } from '../types';

const API_BASE = 'https://api.freeapi.app/api/v1';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<Response> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.name === 'AbortError' ||
        error.message?.includes('Network request failed'))
    ) {
      console.log('🔁 Retry API call...', url);
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
};

export const api = {
  // =====================
  // INSTRUCTORS
  // =====================
  async getInstructors(): Promise<Instructor[]> {
    try {
      console.log('👨‍🏫 Fetching instructors...');

      const response = await fetchWithRetry(
        `${API_BASE}/public/randomusers?page=1&limit=20`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('📥 RAW USERS:', data.data.data);

      return data.data.data.map((user: any) => ({
        id: user.id,

        name:
          `${user.name?.first ?? ''} ${user.name?.last ?? ''}`.trim() ||
          'Unknown Instructor',

        email: user.email,

        // ✅ FIXED IMAGE (IMPORTANT)
        avatar:
          user.picture?.large ||
          user.picture?.medium ||
          user.avatar ||
          'https://via.placeholder.com/150',

        role: 'Instructor',
      }));
    } catch (error) {
      console.log('❌ Instructor Error:', error);
      throw new Error('Failed to load instructors');
    }
  },

  // =====================
  // COURSES
  // =====================
  async getCourses(): Promise<Course[]> {
    try {
      console.log('📚 Fetching courses...');

      const response = await fetchWithRetry(
        `${API_BASE}/public/randomproducts?page=1&limit=20`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('📥 RAW PRODUCTS:', data.data.data);

      return data.data.data.map((product: any) => ({
        id: product.id,

        title:
          product.title ||
          product.name ||
          product.productName ||
          'Untitled Course',

        description:
          product.description ||
          'No description available',

        price: product.price ?? 0,

        category: product.category || 'General',

        // ✅ SAFE IMAGE FIX
        image:
          product.thumbnail ||
          product.images?.[0] ||
          product.image ||
          'https://via.placeholder.com/300',

        instructorId: Math.floor(Math.random() * 20) + 1,
      }));
    } catch (error) {
      console.log('❌ Courses Error:', error);
      throw new Error('Failed to load courses');
    }
  },

  // =====================
  // SINGLE COURSE
  // =====================
  async getCourseWithInstructor(courseId: number): Promise<Course | null> {
    try {
      const [courses, instructors] = await Promise.all([
        this.getCourses(),
        this.getInstructors(),
      ]);

      const course = courses.find(c => c.id === courseId);

      if (!course) return null;

      const instructor = instructors.find(
        i => i.id === course.instructorId
      );

      return {
        ...course,
        instructor,
      };
    } catch (error) {
      console.log('❌ Single course error:', error);
      throw error;
    }
  },
};