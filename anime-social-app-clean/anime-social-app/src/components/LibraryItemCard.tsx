import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface LibraryItemCardProps {
  item: {
    id: string;
    contentId: string;
    title: string;
    type: string;
    coverImage: string;
    userRating: number | null;
  };
  viewMode: 'grid' | 'list';
  onPress: () => void;
  onLongPress: () => void;
  isSelected: boolean;
}

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({
  item,
  viewMode,
  onPress,
  onLongPress,
  isSelected,
}) => {
  const { theme } = useTheme();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anime': return '📺';
      case 'manga': return '📖';
      case 'book': return '📚';
      default: return '📄';
    }
  };

  if (viewMode === 'grid') {
    return (
      <Pressable
        style={styles.gridContainer}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={500}
      >
        <View style={[styles.gridImageContainer, isSelected && styles.selectedBorder]}>
          <Image source={{ uri: item.coverImage }} style={styles.gridImage} />
          
          {/* Selection Overlay */}
          {isSelected && (
            <View style={[styles.selectionOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <TouchableOpacity style={styles.overlayButton}>
                <Text style={styles.overlayIcon}>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.overlayButton}>
                <Text style={styles.overlayIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Rating Badge */}
          {item.userRating && (
            <View style={[styles.ratingBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.ratingText}>⭐ {item.userRating}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.gridTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
      </Pressable>
    );
  }

  // List View
  return (
    <Pressable
      style={[styles.listContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, isSelected && styles.selectedBorder]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <Image source={{ uri: item.coverImage }} style={styles.listImage} />
      
      <View style={styles.listInfo}>
        <Text style={[styles.listTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.listType, { color: theme.colors.textSecondary }]}>
          {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
        {item.userRating && (
          <Text style={[styles.listRating, { color: theme.colors.primary }]}>
            ⭐ {item.userRating}/5
          </Text>
        )}
      </View>

      {/* Selection Overlay for List */}
      {isSelected && (
        <View style={styles.listOverlay}>
          <TouchableOpacity style={styles.listOverlayButton}>
            <Text style={styles.overlayIcon}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listOverlayButton}>
            <Text style={styles.overlayIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Grid Styles
  gridContainer: {
    flex: 1,
    maxWidth: '33.33%',
    padding: 6,
  },
  gridImageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayIcon: {
    fontSize: 20,
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderRadius: 10,
  },

  // List Styles
  listContainer: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  listImage: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  listType: {
    fontSize: 13,
    marginBottom: 4,
  },
  listRating: {
    fontSize: 13,
    fontWeight: '600',
  },
  listOverlay: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8,
  },
  listOverlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
