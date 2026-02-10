import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type TabName = 'home' | 'library' | 'create' | 'notifications' | 'profile';

interface BottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  const tabs: { name: TabName; icon: string; label: string }[] = [
    { name: 'home', icon: '🏠', label: 'Home' },
    { name: 'library', icon: '📚', label: 'Library' },
    { name: 'create', icon: '➕', label: 'Create' },
    { name: 'notifications', icon: '🔔', label: 'Notifications' },
    { name: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabChange(tab.name)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.icon,
            { opacity: activeTab === tab.name ? 1 : 0.5 }
          ]}>
            {tab.icon}
          </Text>
          {activeTab === tab.name && (
            <View style={[styles.indicator, { backgroundColor: theme.colors.primary }]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 24,
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 32,
    height: 3,
    borderRadius: 2,
  },
});
