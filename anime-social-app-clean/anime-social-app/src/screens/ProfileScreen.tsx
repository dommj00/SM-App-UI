import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemeMode } from '../types';

export const ProfileScreen: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themes: { mode: ThemeMode; label: string }[] = [
    { mode: 'light', label: 'Light Mode' },
    { mode: 'dark', label: 'Dark Mode' },
    { mode: 'paper', label: 'Paper Mode' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Your profile settings will appear here
      </Text>

      <View style={styles.themeSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Theme</Text>
        <View style={styles.themesContainer}>
          {themes.map((t) => (
            <TouchableOpacity
              key={t.mode}
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeMode === t.mode ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setThemeMode(t.mode)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color: themeMode === t.mode ? '#FFFFFF' : theme.colors.text,
                  },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  themeSection: {
    width: '100%',
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themesContainer: {
    gap: 12,
  },
  themeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
