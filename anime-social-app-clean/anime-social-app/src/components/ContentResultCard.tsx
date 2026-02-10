import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ContentType } from '../types';

interface ContentResult {
  id: string;
  title: string;
  type: ContentType;
  coverImage: string;
  rating: number;
  episodes?: number;
  chapters?: number;
  pages?: number;
  author?: string;
  status?: string;
}

interface ContentResultCardProps {
  content: ContentResult;
  onPress?: () => void;
}

export const ContentResultCard: React.FC<ContentResultCardProps> = ({ content, onPress }) => {
  const { theme } = useTheme();

  const getMetadata = (): string => {
    switch (content.type) {
      case 'anime':
        return `${content.episodes} episodes${content.status ? ` • ${content.status}` : ''}`;
      case 'manga':
        return `${content.chapters} chapters${content.status ? ` • ${content.status}` : ''}`;
      case 'book':
        return `${content.author}${content.pages ? ` • ${content.pages} pages` : ''}`;
      default:
        return '';
    }
  };

  const getTypeColor = (): string => {
    switch (content.type) {
      case 'anime':
        return '#FF6584';
      case 'manga':
        return '#6C63FF';
      case 'book':
        return '#4ECDC4';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: content.coverImage }} style={styles.cover} />
      <View style={styles.info}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
            <Text style={styles.typeText}>{content.type.toUpperCase()}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={[styles.star, { color: theme.colors.star }]}>★</Text>
            <Text style={[styles.ratingText, { color: theme.colors.text }]}>
              {content.rating.toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {content.title}
        </Text>
        <Text style={[styles.metadata, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {getMetadata()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 1,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  metadata: {
    fontSize: 13,
  },
});
