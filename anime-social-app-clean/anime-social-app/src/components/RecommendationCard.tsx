import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  item: Recommendation;
  onPress?: () => void;
}

const CARD_WIDTH = 120;
const CARD_HEIGHT = 180;

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
      <View style={styles.overlay}>
        <View style={[styles.ratingBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text style={[styles.reviewCount, { color: theme.colors.textSecondary }]}>
          {formatReviewCount(item.reviewCount)} reviews
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const formatReviewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  coverImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewCount: {
    fontSize: 11,
  },
});
