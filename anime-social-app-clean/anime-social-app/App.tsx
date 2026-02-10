import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { BottomNav, TabName } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { ContentDetailScreen } from './src/screens/ContentDetailScreen';

function MainApp() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleSearchPress = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleContentPress = (contentId: string) => {
    setSelectedContentId(contentId);
  };

  const handleContentClose = () => {
    setSelectedContentId(null);
  };

  const handleCreatePostClose = () => {
    setIsCreatePostOpen(false);
  };

  const handleNewPost = (post: any) => {
    console.log('New post created:', post);
    // TODO: Add to feed
  };

  const renderScreen = () => {
    if (selectedContentId) {
      return <ContentDetailScreen contentId={selectedContentId} onClose={handleContentClose} />;
    }

    // Show search screen if search is open
    if (isSearchOpen) {
      return <SearchScreen onClose={handleSearchClose} onContentPress={handleContentPress} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onSearchPress={handleSearchPress} onContentPress={handleContentPress} />;
      case 'library':
        return <LibraryScreen />;
      case 'create':
        // Create is a modal, so show Home in background
        return <HomeScreen onSearchPress={handleSearchPress} onContentPress={handleContentPress} />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onSearchPress={handleSearchPress} onContentPress={handleContentPress} />;
    }
  };

  const handleTabChange = (tab: TabName) => {
    if (tab === 'create') {
      setIsCreatePostOpen(true);
      return; // Don't change activeTab
    }
    setIsSearchOpen(false);
    setSelectedContentId(null);
    setActiveTab(tab);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>{renderScreen()}</View>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </SafeAreaView>

      {/* Create Post Modal */}
      <CreatePostScreen
        visible={isCreatePostOpen}
        onClose={handleCreatePostClose}
        onPost={handleNewPost}
      />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});
