import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ContentSelector } from '../components/ContentSelector';
import { ChapterEpisodeSelector } from '../components/ChapterEpisodeSelector';
import { PollCreator } from '../components/PollCreator';
import { StarRatingInput } from '../components/StarRatingInput';
import { DiscardConfirmModal } from '../components/DiscardConfirmModal';

interface CreatePostScreenProps {
  visible: boolean;
  onClose: () => void;
  onPost: (post: any) => void;
}

interface SelectedContent {
  id: string;
  title: string;
  type: 'anime' | 'manga' | 'book';
}

interface SelectedChapterEpisode {
  id: string;
  number: number;
  title: string;
  season?: number;
  volume?: number;
}

interface PollData {
  options: string[];
  endsInDays: number;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  visible,
  onClose,
  onPost,
}) => {
  const { theme } = useTheme();

  // Content state
  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [selectedChapterEpisode, setSelectedChapterEpisode] = useState<SelectedChapterEpisode | null>(null);
  const [showChapterSelector, setShowChapterSelector] = useState(false);

  // Post content state
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  // UI state
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const hasContent = text.trim() !== '' || images.length > 0;
  const canPost = text.trim() !== '' || images.length > 0;
  const hasPollWithoutText = poll !== null && text.trim() === '';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anime': return '📺';
      case 'manga': return '📖';
      case 'book': return '📚';
      default: return '📄';
    }
  };

  const getChapterEpisodeLabel = () => {
    if (!selectedContent) return '';
    return selectedContent.type === 'anime' ? 'Episode' : 'Chapter';
  };

  const formatContentDisplay = () => {
    if (!selectedContent) return '';
    
    let display = `${getTypeIcon(selectedContent.type)} ${selectedContent.title}`;
    
    if (selectedChapterEpisode) {
      const prefix = selectedContent.type === 'anime' ? 'Ep' : 'Ch';
      display += ` • ${prefix} ${selectedChapterEpisode.number}`;
    }
    
    return display;
  };

  const handleClose = () => {
    if (hasContent) {
      setShowDiscardModal(true);
    } else {
      handleDiscard();
    }
  };

  const handleDiscard = () => {
    // Reset all state
    setSelectedContent(null);
    setSelectedChapterEpisode(null);
    setText('');
    setImages([]);
    setPoll(null);
    setHashtags([]);
    setRating(null);
    setHashtagInput('');
    setShowDiscardModal(false);
    onClose();
  };

  const handlePost = () => {
    if (!canPost || hasPollWithoutText) return;

    const post = {
      id: `post-${Date.now()}`,
      content: selectedContent,
      chapterEpisode: selectedChapterEpisode,
      text: text.trim(),
      images,
      poll,
      hashtags,
      rating,
      timestamp: new Date().toISOString(),
    };

    onPost(post);
    handleDiscard();
  };

  const handleAddImage = () => {
    // Placeholder: In real app, open image picker
    if (images.length < 3) {
      const placeholderImage = `https://picsum.photos/seed/${Date.now()}/400/300`;
      setImages([...images, placeholderImage]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const handleRemoveHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  const handleContentSelect = (content: SelectedContent | null) => {
    setSelectedContent(content);
    setSelectedChapterEpisode(null); // Reset chapter when content changes
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={[styles.closeIcon, { color: theme.colors.text }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Post</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={!canPost || hasPollWithoutText}
            style={[
              styles.postButton,
              { backgroundColor: canPost && !hasPollWithoutText ? theme.colors.primary : theme.colors.border },
            ]}
          >
            <Text style={[styles.postButtonText, { color: canPost && !hasPollWithoutText ? '#FFFFFF' : theme.colors.textSecondary }]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Content Selector Row */}
          <View style={styles.contentSelectorRow}>
            <View style={styles.contentSelectorWrapper}>
              <ContentSelector
                selectedContent={selectedContent}
                onSelectContent={handleContentSelect}
              />
            </View>

            {selectedContent && (
              <TouchableOpacity
                style={[styles.chapterButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={() => setShowChapterSelector(true)}
              >
                <Text style={[styles.chapterButtonText, { color: selectedChapterEpisode ? theme.colors.primary : theme.colors.textSecondary }]}>
                  {selectedChapterEpisode
                    ? `${getChapterEpisodeLabel()} ${selectedChapterEpisode.number}`
                    : getChapterEpisodeLabel()}
                </Text>
                <Text style={[styles.chapterButtonIcon, { color: theme.colors.textSecondary }]}>▼</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Selected Content Display */}
          {selectedContent && (
            <View style={styles.selectedContentDisplay}>
              <Text style={[styles.selectedContentText, { color: theme.colors.textSecondary }]}>
                {formatContentDisplay()}
              </Text>
            </View>
          )}

          {/* Text Input */}
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            placeholder="Share your thoughts..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />

          {/* Star Rating */}
          {showRating && (
            <StarRatingInput rating={rating} onRatingChange={setRating} />
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeImageIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Poll Preview */}
          {poll && (
            <View style={[styles.pollPreview, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.pollHeader}>
                <Text style={[styles.pollLabel, { color: theme.colors.textSecondary }]}>Poll</Text>
                <TouchableOpacity onPress={() => setPoll(null)}>
                  <Text style={[styles.pollRemove, { color: theme.colors.primary }]}>Remove</Text>
                </TouchableOpacity>
              </View>
              {poll.options.map((option, index) => (
                <View key={index} style={[styles.pollOption, { borderColor: theme.colors.border }]}>
                  <Text style={[styles.pollOptionText, { color: theme.colors.text }]}>{option}</Text>
                </View>
              ))}
              <Text style={[styles.pollDuration, { color: theme.colors.textSecondary }]}>
                Ends in {poll.endsInDays} day{poll.endsInDays !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <View style={styles.hashtagsContainer}>
              {hashtags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.hashtagChip, { backgroundColor: theme.colors.primary + '20' }]}
                  onPress={() => handleRemoveHashtag(index)}
                >
                  <Text style={[styles.hashtagText, { color: theme.colors.primary }]}>#{tag}</Text>
                  <Text style={[styles.hashtagRemove, { color: theme.colors.primary }]}> ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Poll error message */}
          {hasPollWithoutText && (
            <Text style={[styles.errorText, { color: '#FF4757' }]}>
              Polls require text content
            </Text>
          )}
        </ScrollView>

        {/* Toolbar */}
        <View style={[styles.toolbar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={handleAddImage}
            disabled={images.length >= 3}
          >
            <Text style={[styles.toolbarIcon, { opacity: images.length >= 3 ? 0.3 : 1 }]}>🖼️</Text>
            {images.length > 0 && (
              <Text style={[styles.toolbarBadge, { color: theme.colors.textSecondary }]}>
                {images.length}/3
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowPollCreator(true)}
            disabled={poll !== null}
          >
            <Text style={[styles.toolbarIcon, { opacity: poll !== null ? 0.3 : 1 }]}>📊</Text>
          </TouchableOpacity>

          <View style={styles.hashtagInputContainer}>
            <TextInput
              style={[styles.hashtagInputField, { color: theme.colors.text }]}
              placeholder="#hashtag"
              placeholderTextColor={theme.colors.textSecondary}
              value={hashtagInput}
              onChangeText={setHashtagInput}
              onSubmitEditing={handleAddHashtag}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowRating(!showRating)}
          >
            <Text style={[styles.toolbarIcon, { opacity: showRating ? 1 : 0.6 }]}>
              {rating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chapter/Episode Selector Modal */}
        {selectedContent && (
          <ChapterEpisodeSelector
            visible={showChapterSelector}
            contentId={selectedContent.id}
            contentType={selectedContent.type}
            onClose={() => setShowChapterSelector(false)}
            onSelect={setSelectedChapterEpisode}
          />
        )}

        {/* Poll Creator Modal */}
        <PollCreator
          visible={showPollCreator}
          onClose={() => setShowPollCreator(false)}
          onSave={setPoll}
          initialPoll={poll}
        />

        {/* Discard Confirmation Modal */}
        <DiscardConfirmModal
          visible={showDiscardModal}
          onDiscard={handleDiscard}
          onKeepEditing={() => setShowDiscardModal(false)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  contentSelectorWrapper: {
    flex: 1,
  },
  chapterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  chapterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chapterButtonIcon: {
    fontSize: 10,
  },
  selectedContentDisplay: {
    marginBottom: 16,
  },
  selectedContentText: {
    fontSize: 13,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageIcon: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  pollPreview: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pollRemove: {
    fontSize: 13,
    fontWeight: '600',
  },
  pollOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  pollOptionText: {
    fontSize: 15,
  },
  pollDuration: {
    fontSize: 12,
    marginTop: 4,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hashtagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hashtagRemove: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 13,
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  toolbarIcon: {
    fontSize: 24,
  },
  toolbarBadge: {
    fontSize: 11,
    marginLeft: 4,
  },
  hashtagInputContainer: {
    flex: 1,
  },
  hashtagInputField: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
