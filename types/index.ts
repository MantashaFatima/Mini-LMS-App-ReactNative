export interface Instructor {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  instructorId: number;
  instructor?: Instructor;
  isBookmarked?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}