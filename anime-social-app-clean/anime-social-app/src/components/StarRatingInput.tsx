import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface StarRatingInputProps {
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  onRatingChange,
}) => {
  const { theme } = useTheme();

  const handleStarPress = (star: number) => {
    if (rating === star) {
      onRatingChange(null); // Tap same star to clear
    } else {
      onRatingChange(star);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
        Your Rating
      </Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            activeOpacity={0.7}
          >
            <Text style={styles.star}>
              {rating && star <= rating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {rating && (
        <TouchableOpacity onPress={() => onRatingChange(null)}>
          <Text style={[styles.clearText, { color: theme.colors.primary }]}>
            Clear rating
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  star: {
    fontSize: 32,
  },
  clearText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
});
