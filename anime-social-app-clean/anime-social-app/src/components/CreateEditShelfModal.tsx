import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import searchData from '../data/mockSearchData.json';

interface ShelfItem {
  id: string;
  contentId: string;
  title: string;
  type: string;
  coverImage: string;
  userRating: number | null;
  userReview: string | null;
  addedAt: string;
}

interface Shelf {
  id: string;
  name: string;
  description: string;
  isProtected: boolean;
  items: ShelfItem[];
}

interface CreateEditShelfModalProps {
  visible: boolean;
  shelf?: Shelf | null; // null = create mode, shelf = edit mode
  onClose: () => void;
  onSave: (shelfData: { name: string; description: string; items: ShelfItem[] }) => void;
}

export const CreateEditShelfModal: React.FC<CreateEditShelfModalProps> = ({
  visible,
  shelf,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const isEditMode = !!shelf;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [showContentSearch, setShowContentSearch] = useState(false);
  const [contentSearchQuery, setContentSearchQuery] = useState('');

  useEffect(() => {
    if (shelf) {
      setName(shelf.name);
      setDescription(shelf.description);
      setItems([...shelf.items]);
    } else {
      setName('');
      setDescription('');
      setItems([]);
    }
  }, [shelf, visible]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anime': return '📺';
      case 'manga': return '📖';
      case 'book': return '📚';
      default: return '📄';
    }
  };

  const searchResults = contentSearchQuery.trim()
    ? searchData.content.filter((item) =>
        item.title.toLowerCase().includes(contentSearchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleAddContent = (content: any) => {
    const alreadyAdded = items.some((item) => item.contentId === content.id);
    if (alreadyAdded) return;

    const newItem: ShelfItem = {
      id: `item-${Date.now()}`,
      contentId: content.id,
      title: content.title,
      type: content.type,
      coverImage: content.coverImage,
      userRating: null,
      userReview: null,
      addedAt: new Date().toISOString(),
    };

    setItems([...items, newItem]);
    setContentSearchQuery('');
    setShowContentSearch(false);
  };

  const handleRemoveContent = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      items,
    });
    onClose();
  };

  const canSave = name.trim() !== '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeIcon, { color: theme.colors.text }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isEditMode ? 'Edit Shelf' : 'Create Shelf'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            style={[
              styles.saveButton,
              { backgroundColor: canSave ? theme.colors.primary : theme.colors.border },
            ]}
          >
            <Text style={[styles.saveButtonText, { color: canSave ? '#FFFFFF' : theme.colors.textSecondary }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Name *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Enter shelf name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              maxLength={50}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="What's this shelf about?"
              placeholderTextColor={theme.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Content ({items.length})
              </Text>
              <TouchableOpacity onPress={() => setShowContentSearch(true)}>
                <Text style={[styles.addContentButton, { color: theme.colors.primary }]}>
                  + Add Content
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content Search */}
            {showContentSearch && (
              <View style={[styles.contentSearchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.contentSearchHeader}>
                  <TextInput
                    style={[styles.contentSearchInput, { color: theme.colors.text }]}
                    placeholder="Search anime, manga, books..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={contentSearchQuery}
                    onChangeText={setContentSearchQuery}
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => { setShowContentSearch(false); setContentSearchQuery(''); }}>
                    <Text style={[styles.cancelSearch, { color: theme.colors.primary }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                {searchResults.length > 0 && (
                  <View style={styles.searchResults}>
                    {searchResults.map((result) => {
                      const alreadyAdded = items.some((item) => item.contentId === result.id);
                      return (
                        <TouchableOpacity
                          key={result.id}
                          style={[styles.searchResultItem, { borderBottomColor: theme.colors.border }]}
                          onPress={() => handleAddContent(result)}
                          disabled={alreadyAdded}
                        >
                          <Text style={styles.resultIcon}>{getTypeIcon(result.type)}</Text>
                          <Text style={[styles.resultTitle, { color: theme.colors.text }]} numberOfLines={1}>
                            {result.title}
                          </Text>
                          {alreadyAdded && (
                            <Text style={[styles.addedBadge, { color: theme.colors.textSecondary }]}>Added</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* Added Items */}
            {items.length > 0 ? (
              <View style={styles.addedItems}>
                {items.map((item) => (
                  <View key={item.id} style={[styles.addedItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Image source={{ uri: item.coverImage }} style={styles.itemCover} />
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[styles.itemType, { color: theme.colors.textSecondary }]}>
                        {getTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveContent(item.id)} style={styles.removeItemButton}>
                      <Text style={[styles.removeItemIcon, { color: theme.colors.textSecondary }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[styles.emptyContent, { borderColor: theme.colors.border }]}>
                <Text style={[styles.emptyContentText, { color: theme.colors.textSecondary }]}>
                  No content added yet
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
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
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  contentSection: {
    marginBottom: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addContentButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSearchContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  contentSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  contentSearchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  cancelSearch: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  searchResults: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  resultTitle: {
    flex: 1,
    fontSize: 15,
  },
  addedBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  addedItems: {
    gap: 8,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  itemCover: {
    width: 40,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
  },
  removeItemButton: {
    padding: 8,
  },
  removeItemIcon: {
    fontSize: 16,
  },
  emptyContent: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyContentText: {
    fontSize: 14,
  },
});
