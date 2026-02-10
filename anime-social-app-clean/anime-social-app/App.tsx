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

function MainApp() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchPress = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const renderScreen = () => {
    // Show search screen if search is open
    if (isSearchOpen) {
      return <SearchScreen onClose={handleSearchClose} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onSearchPress={handleSearchPress} />;
      case 'library':
        return <LibraryScreen />;
      case 'create':
        return <CreatePostScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onSearchPress={handleSearchPress} />;
    }
  };

  const handleTabChange = (tab: TabName) => {
    setIsSearchOpen(false); // Close search when changing tabs
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
