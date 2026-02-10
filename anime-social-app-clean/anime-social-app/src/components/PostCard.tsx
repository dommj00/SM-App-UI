import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width - 32;

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
}) => {
  const { theme } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post: ${post.content.substring(0, 100)}...`,
        url: `app://post/${post.id}`,
      });
      onShare?.();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={[styles.displayName, { color: theme.colors.text }]}>
            {post.user.displayName}
          </Text>
          <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
            @{post.user.username} • {formatTimestamp(post.timestamp)}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={[styles.moreIcon, { color: theme.colors.textSecondary }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Content Reference (if exists) */}
      {post.contentRef && (
        <View style={[styles.contentRef, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.contentRefInfo}>
            <Text style={[styles.contentRefType, { color: theme.colors.primary }]}>
              {post.contentRef.type.toUpperCase()}
            </Text>
            <Text style={[styles.contentRefTitle, { color: theme.colors.text }]}>
              {post.contentRef.title}
              {post.contentRef.episode && ` • Ep ${post.contentRef.episode}`}
              {post.contentRef.chapter && ` • Ch ${post.contentRef.chapter}`}
            </Text>
          </View>
          {post.rating && (
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    { color: star <= post.rating! ? theme.colors.star : theme.colors.border },
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Post Content */}
      <Text style={[styles.content, { color: theme.colors.text }]}>{post.content}</Text>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {post.images.length === 1 && (
            <Image source={{ uri: post.images[0] }} style={styles.singleImage} />
          )}
          {post.images.length === 2 && (
            <View style={styles.twoImagesContainer}>
              {post.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.halfImage} />
              ))}
            </View>
          )}
          {post.images.length === 3 && (
            <View style={styles.threeImagesContainer}>
              <Image source={{ uri: post.images[0] }} style={styles.largeImage} />
              <View style={styles.smallImagesColumn}>
                <Image source={{ uri: post.images[1] }} style={styles.smallImage} />
                <Image source={{ uri: post.images[2] }} style={styles.smallImage} />
              </View>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={[styles.actions, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Text style={[styles.actionIcon, { color: post.isLiked ? theme.colors.like : theme.colors.textSecondary }]}>
            {post.isLiked ? '❤' : '♡'}
          </Text>
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {formatCount(post.likes)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
          <Text style={[styles.actionIcon, { color: theme.colors.textSecondary }]}>💬</Text>
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {formatCount(post.comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={[styles.actionIcon, { color: theme.colors.textSecondary }]}>↗</Text>
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {formatCount(post.shares)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onBookmark}>
          <Text style={[styles.actionIcon, { color: post.isBookmarked ? theme.colors.primary : theme.colors.textSecondary }]}>
            {post.isBookmarked ? '🔖' : '⛶'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentRef: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  contentRefInfo: {
    marginBottom: 6,
  },
  contentRefType: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  contentRefTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  singleImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 0.75,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  twoImagesContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
  },
  halfImage: {
    flex: 1,
    height: 240,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  threeImagesContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    height: 280,
  },
  largeImage: {
    flex: 2,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  smallImagesColumn: {
    flex: 1,
    gap: 4,
  },
  smallImage: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 6,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
