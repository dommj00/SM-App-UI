import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FeedFilter } from '../types';

interface FeedHeaderProps {
  activeFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({ activeFilter, onFilterChange }) => {
  const { theme } = useTheme();

  const filters: { key: FeedFilter; label: string }[] = [
    { key: 'discover', label: 'Discover' },
    { key: 'discover+friends', label: 'Discover + Friends' },
    { key: 'friends', label: 'Friends' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter.key ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => onFilterChange(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: activeFilter === filter.key ? '#FFFFFF' : theme.colors.text,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
