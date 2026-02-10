export type ContentType = 'anime' | 'manga' | 'book';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

export interface Recommendation {
  id: string;
  title: string;
  coverImage: string;
  type: ContentType;
  rating: number;
  reviewCount: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  contentRef?: {
    title: string;
    type: ContentType;
    episode?: number;
    chapter?: number;
  };
  rating?: number;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

export type FeedFilter = 'discover' | 'discover+friends' | 'friends';

export type ThemeMode = 'light' | 'dark' | 'paper';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    like: string;
    star: string;
  };
}
