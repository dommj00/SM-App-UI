# Anime Social Media App

A React Native social media application for anime, manga, and book enthusiasts to connect and discuss content.

## Features

- 📱 **Home Feed** with infinite scroll and pull-to-refresh
- 🎯 **Smart Filters**: Discover, Discover + Friends, Friends
- 📚 **Recommendations** horizontal scroll section
- ⭐ **Post Cards** with ratings, images (up to 3), and engagement metrics
- 🎨 **Multiple Themes**: Light Mode, Dark Mode, Paper Mode
- 📖 **Library** for custom collections (placeholder)
- 🔔 **Notifications** (placeholder)
- 👤 **Profile** with theme switcher

## Tech Stack

- **React Native** + **Expo**
- **TypeScript** for type safety
- **Tabler Icons** for iconography
- iOS and Android compatible
- Web preview support

## Project Structure

```
anime-social-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FeedHeader.tsx
│   │   ├── RecommendationCard.tsx
│   │   ├── PostCard.tsx
│   │   └── BottomNav.tsx
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── LibraryScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── theme/               # Theme configuration
│   │   ├── colors.ts
│   │   └── ThemeContext.tsx
│   ├── data/                # Mock data (JSON)
│   │   ├── mockPosts.json
│   │   └── mockRecommendations.json
│   └── types/               # TypeScript types
│       └── index.ts
├── App.tsx                  # Main app entry
└── package.json
```

## Running in GitHub Codespaces

### Step 1: Open in Codespaces

1. Go to the repository on GitHub
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Wait for the environment to load

### Step 2: Install Dependencies (if needed)

```bash
npm install --legacy-peer-deps
```

### Step 3: Run the App

```bash
npm run web
```

Or:

```bash
npx expo start --web
```

### Step 4: View the App

- Codespaces will automatically forward port 8081
- Click the popup notification to open in browser
- Or go to **Ports** tab → click the globe icon next to port 8081

## Running Locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# For web preview
npm run web

# For iOS (requires macOS + Xcode)
npm run ios

# For Android (requires Android Studio)
npm run android
```

## Features Overview

### Home Screen

- **Feed Filters**: Switch between Discover, Discover + Friends, and Friends
- **Recommendations**: Horizontal scrolling content cards with ratings
- **Posts**: 
  - User avatar, username, and timestamp
  - Content text
  - Reference to anime/manga/book with episode/chapter info
  - Star ratings (1-5)
  - Images (1-3 images per post)
  - Like, Comment, Share, Bookmark actions
- **Pull to Refresh**: Swipe down to refresh feed
- **Infinite Scroll**: Automatically loads more posts when scrolling down

### Theme System

The app supports three themes:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for night viewing
- **Paper Mode**: Warm, book-like aesthetic

Switch themes in the Profile screen.

## Mock Data

The app uses JSON files for mock data:

- `mockRecommendations.json`: Recommended content (anime/manga/books)
- `mockPosts.json`: Feed posts with various content types

### Post Structure

```json
{
  "id": "post-1",
  "user": {
    "id": "user-1",
    "username": "animefan_2024",
    "displayName": "Anime Fan",
    "avatar": "https://..."
  },
  "content": "Post text content...",
  "images": ["image1.jpg", "image2.jpg"],
  "contentRef": {
    "title": "Attack on Titan",
    "type": "anime",
    "episode": 5
  },
  "rating": 5,
  "likes": 1243,
  "comments": 89,
  "shares": 34,
  "timestamp": "2024-02-10T10:30:00Z",
  "isLiked": false,
  "isBookmarked": false
}
```

## Customization

### Adding New Themes

Edit `src/theme/colors.ts`:

```typescript
export const customTheme: Theme = {
  mode: 'custom',
  colors: {
    primary: '#YOUR_COLOR',
    // ... other colors
  },
};
```

### Modifying Mock Data

Edit JSON files in `src/data/`:
- Add new posts to `mockPosts.json`
- Add new recommendations to `mockRecommendations.json`

## Component Architecture

All components are modular and themeable:

- **FeedHeader**: Manages filter state
- **RecommendationCard**: Displays content recommendations
- **PostCard**: Main feed item with images and actions
- **BottomNav**: Tab navigation

## Known Limitations

- Tabler Icons (@tabler/icons-react-native) are installed but emoji icons are used for simplicity
- Create Post screen is a placeholder
- Library screen is a placeholder
- Notifications screen is a placeholder
- Share functionality uses native Share API

## Future Enhancements

- [ ] Implement Create Post functionality
- [ ] Build Library management system
- [ ] Add Notifications system
- [ ] Implement actual API integration
- [ ] Add authentication
- [ ] Image upload functionality
- [ ] Comments section
- [ ] User profiles
- [ ] Search functionality

## Troubleshooting

### Port not forwarding
- Go to **Ports** tab in Codespaces
- Right-click port 8081 → **Port Visibility** → **Public**

### Blank screen
- Check browser console (F12) for errors
- Try clearing cache: `npx expo start --web --clear`

### Dependency errors
- Always use `--legacy-peer-deps` flag:
  ```bash
  npm install --legacy-peer-deps
  ```

## License

MIT
