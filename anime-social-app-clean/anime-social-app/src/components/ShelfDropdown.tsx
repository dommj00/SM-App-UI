import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Shelf {
  id: string;
  name: string;
  description: string;
  isProtected: boolean;
  items: any[];
}

interface ShelfDropdownProps {
  shelves: Shelf[];
  selectedShelf: Shelf | null;
  contentTypeFilter: string;
  onSelectShelf: (shelf: Shelf) => void;
  onEditShelf: (shelf: Shelf) => void;
  onDeleteShelf: (shelf: Shelf) => void;
}

export const ShelfDropdown: React.FC<ShelfDropdownProps> = ({
  shelves,
  selectedShelf,
  contentTypeFilter,
  onSelectShelf,
  onEditShelf,
  onDeleteShelf,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter shelves based on content type filter and search query
  const filteredShelves = useMemo(() => {
    return shelves.filter((shelf) => {
      // Filter by content type if not "all"
      if (contentTypeFilter !== 'all') {
        const hasContentType = shelf.items.some(
          (item) => item.type === contentTypeFilter
        );
        if (!hasContentType) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        return shelf.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [shelves, contentTypeFilter, searchQuery]);

  const handleSelectShelf = (shelf: Shelf) => {
    onSelectShelf(shelf);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getShelfItemCount = (shelf: Shelf) => {
    if (contentTypeFilter === 'all') {
      return shelf.items.length;
    }
    return shelf.items.filter((item) => item.type === contentTypeFilter).length;
  };

  return (
    <View>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.dropdownButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownIcon}>📂</Text>
        <Text style={[styles.dropdownText, { color: theme.colors.text }]} numberOfLines={1}>
          {selectedShelf?.name || 'Select a Shelf'}
        </Text>
        <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Select Shelf
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                placeholder="Search shelves..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={[styles.clearButton, { color: theme.colors.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Shelf List */}
            {filteredShelves.length > 0 ? (
              <FlatList
                data={filteredShelves}
                keyExtractor={(item) => item.id}
                style={styles.list}
                renderItem={({ item }) => (
                  <View style={[styles.shelfItem, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity
                      style={styles.shelfItemContent}
                      onPress={() => handleSelectShelf(item)}
                    >
                      <View style={styles.shelfInfo}>
                        <Text style={[styles.shelfName, { color: theme.colors.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.shelfCount, { color: theme.colors.textSecondary }]}>
                          {getShelfItemCount(item)} item{getShelfItemCount(item) !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      {selectedShelf?.id === item.id && (
                        <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                      )}
                    </TouchableOpacity>

                    {!item.isProtected && (
                      <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                          setIsOpen(false);
                          // Show options
                        }}
                      >
                        <Text style={[styles.moreIcon, { color: theme.colors.textSecondary }]}>⋮</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No shelves found
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    borderRadius: 16,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  clearButton: {
    fontSize: 16,
    padding: 4,
  },
  list: {
    maxHeight: 300,
  },
  shelfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  shelfItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  shelfInfo: {
    flex: 1,
  },
  shelfName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  shelfCount: {
    fontSize: 13,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  moreButton: {
    padding: 16,
  },
  moreIcon: {
    fontSize: 20,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
});
