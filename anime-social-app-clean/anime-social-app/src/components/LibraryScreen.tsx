import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ShelfDropdown } from '../components/ShelfDropdown';
import { LibraryItemCard } from '../components/LibraryItemCard';
import { CreateEditShelfModal } from '../components/CreateEditShelfModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { RateReviewModal } from '../components/RateReviewModal';
import mockShelvesData from '../data/mockShelves.json';

type ContentTypeFilter = 'all' | 'anime' | 'manga' | 'book';
type SortOption = 'newest' | 'oldest' | 'title' | 'rating';
type ViewMode = 'grid' | 'list';

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
  createdAt: string;
  items: ShelfItem[];
}

interface LibraryScreenProps {
  onContentPress?: (contentId: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ onContentPress }) => {
  const { theme } = useTheme();

  // Data state
  const [shelves, setShelves] = useState<Shelf[]>(mockShelvesData.shelves as Shelf[]);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(
    shelves.find((s) => s.id === 'my-library') || null
  );

  // Filter & Sort state
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Modal state
  const [showCreateShelfModal, setShowCreateShelfModal] = useState(false);
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShelfItem | null>(null);
  const [showRateReviewModal, setShowRateReviewModal] = useState(false);
  const [showItemDeleteConfirm, setShowItemDeleteConfirm] = useState(false);

  const contentTypeFilters: { key: ContentTypeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'anime', label: 'Anime' },
    { key: 'manga', label: 'Manga' },
    { key: 'book', label: 'Books' },
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'title', label: 'Title (A-Z)' },
    { key: 'rating', label: 'Rating' },
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!selectedShelf) return [];

    let items = [...selectedShelf.items];

    // Filter by content type
    if (contentTypeFilter !== 'all') {
      items = items.filter((item) => item.type === contentTypeFilter);
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        items.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
        break;
      case 'title':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        items.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
        break;
    }

    return items;
  }, [selectedShelf, contentTypeFilter, sortOption]);

  const handleCreateShelf = (shelfData: { name: string; description: string; items: ShelfItem[] }) => {
    const newShelf: Shelf = {
      id: `shelf-${Date.now()}`,
      name: shelfData.name,
      description: shelfData.description,
      isProtected: false,
      createdAt: new Date().toISOString(),
      items: shelfData.items,
    };
    setShelves([...shelves, newShelf]);
    setSelectedShelf(newShelf);
  };

  const handleEditShelf = (shelfData: { name: string; description: string; items: ShelfItem[] }) => {
    if (!editingShelf) return;

    const updatedShelves = shelves.map((shelf) =>
      shelf.id === editingShelf.id
        ? { ...shelf, name: shelfData.name, description: shelfData.description, items: shelfData.items }
        : shelf
    );
    setShelves(updatedShelves);

    if (selectedShelf?.id === editingShelf.id) {
      setSelectedShelf({ ...editingShelf, name: shelfData.name, description: shelfData.description, items: shelfData.items });
    }

    setEditingShelf(null);
  };

  const handleDeleteShelf = () => {
    if (!shelfToDelete) return;

    setShelves(shelves.filter((shelf) => shelf.id !== shelfToDelete.id));

    if (selectedShelf?.id === shelfToDelete.id) {
      setSelectedShelf(shelves.find((s) => s.id === 'my-library') || null);
    }

    setShelfToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleItemLongPress = (item: ShelfItem) => {
    setSelectedItem(item);
  };

  const handleItemPress = (item: ShelfItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else if (onContentPress) {
      onContentPress(item.contentId);
    }
  };

  const handleDeleteItem = () => {
    if (!selectedItem || !selectedShelf) return;

    const updatedItems = selectedShelf.items.filter((item) => item.id !== selectedItem.id);
    const updatedShelf = { ...selectedShelf, items: updatedItems };

    setShelves(shelves.map((shelf) => (shelf.id === selectedShelf.id ? updatedShelf : shelf)));
    setSelectedShelf(updatedShelf);
    setSelectedItem(null);
    setShowItemDeleteConfirm(false);
  };

  const handleSaveRateReview = (rating: number | null, review: string | null) => {
    if (!selectedItem || !selectedShelf) return;

    const updatedItems = selectedShelf.items.map((item) =>
      item.id === selectedItem.id ? { ...item, userRating: rating, userReview: review } : item
    );
    const updatedShelf = { ...selectedShelf, items: updatedItems };

    setShelves(shelves.map((shelf) => (shelf.id === selectedShelf.id ? updatedShelf : shelf)));
    setSelectedShelf(updatedShelf);
    setSelectedItem(null);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {shelves.length === 1 ? 'Create your first shelf' : 'No items in this shelf'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {shelves.length === 1
          ? 'Organize your favorite anime, manga, and books'
          : 'Add content to this shelf to see it here'}
      </Text>
      {shelves.length === 1 && (
        <TouchableOpacity
          style={[styles.createShelfButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCreateShelfModal(true)}
        >
          <Text style={styles.createShelfButtonText}>Create Shelf</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Library</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Text style={styles.headerIcon}>{viewMode === 'grid' ? '☰' : '▦'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowCreateShelfModal(true)}
          >
            <Text style={styles.headerIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Type Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {contentTypeFilters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: contentTypeFilter === filter.key ? theme.colors.primary : theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setContentTypeFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: contentTypeFilter === filter.key ? '#FFFFFF' : theme.colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Shelf Dropdown & Sort */}
      <View style={styles.controlsRow}>
        <View style={styles.dropdownWrapper}>
          <ShelfDropdown
            shelves={shelves}
            selectedShelf={selectedShelf}
            contentTypeFilter={contentTypeFilter}
            onSelectShelf={setSelectedShelf}
            onEditShelf={(shelf) => {
              setEditingShelf(shelf);
              setShowCreateShelfModal(true);
            }}
            onDeleteShelf={(shelf) => {
              setShelfToDelete(shelf);
              setShowDeleteConfirm(true);
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
        >
          <Text style={[styles.sortButtonText, { color: theme.colors.text }]}>
            {sortOptions.find((o) => o.key === sortOption)?.label || 'Sort'}
          </Text>
          <Text style={[styles.sortArrow, { color: theme.colors.textSecondary }]}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <View style={[styles.sortDropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[styles.sortOption, { borderBottomColor: theme.colors.border }]}
              onPress={() => {
                setSortOption(option.key);
                setShowSortDropdown(false);
              }}
            >
              <Text style={[styles.sortOptionText, { color: theme.colors.text }]}>
                {option.label}
              </Text>
              {sortOption === option.key && (
                <Text style={[styles.sortCheckmark, { color: theme.colors.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Items Grid/List */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 3 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.itemsContainer}
          renderItem={({ item }) => (
            <LibraryItemCard
              item={item}
              viewMode={viewMode}
              onPress={() => handleItemPress(item)}
              onLongPress={() => handleItemLongPress(item)}
              isSelected={selectedItem?.id === item.id}
            />
          )}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Selected Item Actions */}
      {selectedItem && (
        <View style={[styles.itemActionsBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={styles.itemAction}
            onPress={() => setShowItemDeleteConfirm(true)}
          >
            <Text style={styles.itemActionIcon}>🗑️</Text>
            <Text style={[styles.itemActionText, { color: theme.colors.text }]}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemAction}
            onPress={() => setShowRateReviewModal(true)}
          >
            <Text style={styles.itemActionIcon}>✏️</Text>
            <Text style={[styles.itemActionText, { color: theme.colors.text }]}>Rate & Review</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemAction}
            onPress={() => setSelectedItem(null)}
          >
            <Text style={styles.itemActionIcon}>✕</Text>
            <Text style={[styles.itemActionText, { color: theme.colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create/Edit Shelf Modal */}
      <CreateEditShelfModal
        visible={showCreateShelfModal}
        shelf={editingShelf}
        onClose={() => {
          setShowCreateShelfModal(false);
          setEditingShelf(null);
        }}
        onSave={editingShelf ? handleEditShelf : handleCreateShelf}
      />

      {/* Delete Shelf Confirmation */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        title="Delete Shelf?"
        message={`Are you sure you want to delete "${shelfToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmDestructive
        onConfirm={handleDeleteShelf}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setShelfToDelete(null);
        }}
      />

      {/* Delete Item Confirmation */}
      <ConfirmationModal
        visible={showItemDeleteConfirm}
        title="Remove from Shelf?"
        message={`Remove "${selectedItem?.title}" from this shelf?`}
        confirmText="Remove"
        confirmDestructive
        onConfirm={handleDeleteItem}
        onCancel={() => setShowItemDeleteConfirm(false)}
      />

      {/* Rate & Review Modal */}
      {selectedItem && (
        <RateReviewModal
          visible={showRateReviewModal}
          itemTitle={selectedItem.title}
          currentRating={selectedItem.userRating}
          currentReview={selectedItem.userReview}
          onClose={() => {
            setShowRateReviewModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveRateReview}
        />
      )}
    </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  dropdownWrapper: {
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortArrow: {
    fontSize: 10,
  },
  sortDropdown: {
    position: 'absolute',
    top: 160,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sortOptionText: {
    fontSize: 15,
  },
  sortCheckmark: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createShelfButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  createShelfButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  itemAction: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  itemActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  itemActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
