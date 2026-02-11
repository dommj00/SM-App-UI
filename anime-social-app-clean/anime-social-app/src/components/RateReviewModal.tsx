import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface RateReviewModalProps {
  visible: boolean;
  itemTitle: string;
  currentRating: number | null;
  currentReview: string | null;
  onClose: () => void;
  onSave: (rating: number | null, review: string | null) => void;
}

export const RateReviewModal: React.FC<RateReviewModalProps> = ({
  visible,
  itemTitle,
  currentRating,
  currentReview,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [rating, setRating] = useState<number | null>(currentRating);
  const [review, setReview] = useState(currentReview || '');

  const handleStarPress = (star: number) => {
    setRating(rating === star ? null : star);
  };

  const handleSave = () => {
    onSave(rating, review.trim() || null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>Rate & Review</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveText, { color: theme.colors.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {itemTitle}
            </Text>

            {/* Star Rating */}
            <View style={styles.ratingSection}>
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
                <TouchableOpacity onPress={() => setRating(null)}>
                  <Text style={[styles.clearRating, { color: theme.colors.primary }]}>
                    Clear rating
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Review */}
            <View style={styles.reviewSection}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Your Review (Optional)
              </Text>
              <TextInput
                style={[
                  styles.reviewInput,
                  {
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Write your thoughts..."
                placeholderTextColor={theme.colors.textSecondary}
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
                {review.length}/500
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  star: {
    fontSize: 36,
  },
  clearRating: {
    fontSize: 13,
    marginTop: 12,
  },
  reviewSection: {},
  reviewInput: {
    minHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});
