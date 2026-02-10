import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface EpisodeChapterCardProps {
  id: string;
  number: number;
  title: string;
  rating: number;
  reviewCount: number;
  isCompleted: boolean;
  userRating: number | null;
  isAnime: boolean;
  onPress: () => void;
}

export const EpisodeChapterCard: React.FC<EpisodeChapterCardProps> = ({
  number,
  title,
  rating,
  reviewCount,
  isCompleted,
  userRating,
  isAnime,
  onPress,
}) => {
  const { theme } = useTheme();

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getStatusIcon = () => {
    if (isCompleted) return '✓';
    return isAnime ? '▶' : '○';
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statusIcon, { backgroundColor: isCompleted ? theme.colors.primary : 'transparent', borderColor: theme.colors.border }]}>
        <Text style={[styles.statusText, { color: isCompleted ? '#FFFFFF' : theme.colors.textSecondary }]}>
          {getStatusIcon()}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {isAnime ? 'Ep' : 'Ch'} {number}: {title}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
            ⭐ {rating.toFixed(1)} • {formatCount(reviewCount)} reviews
          </Text>
          {userRating && (
            <Text style={[styles.userRating, { color: theme.colors.primary }]}>
              Your: {userRating}/5
            </Text>
          )}
        </View>
      </View>

      <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rating: {
    fontSize: 13,
  },
  userRating: {
    fontSize: 13,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: 8,
  },
});
