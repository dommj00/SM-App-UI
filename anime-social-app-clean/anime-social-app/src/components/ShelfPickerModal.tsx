import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Shelf {
  id: string;
  name: string;
  items: any[];
}

interface ShelfPickerModalProps {
  visible: boolean;
  shelves: Shelf[];
  onClose: () => void;
  onSelectShelf: (shelfId: string) => void;
  onCreateNew: () => void;
}

export const ShelfPickerModal: React.FC<ShelfPickerModalProps> = ({
  visible,
  shelves,
  onClose,
  onSelectShelf,
  onCreateNew,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Add to Shelf</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={shelves}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.shelfItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  onSelectShelf(item.id);
                  onClose();
                }}
              >
                <Text style={styles.shelfIcon}>📂</Text>
                <View style={styles.shelfInfo}>
                  <Text style={[styles.shelfName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.shelfCount, { color: theme.colors.textSecondary }]}>
                    {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={[styles.createButton, { borderTopColor: theme.colors.border }]}
            onPress={() => {
              onCreateNew();
              onClose();
            }}
          >
            <Text style={[styles.createButtonText, { color: theme.colors.primary }]}>
              + Create New Shelf
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    padding: 4,
  },
  list: {
    maxHeight: 300,
  },
  shelfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  shelfIcon: {
    fontSize: 24,
    marginRight: 12,
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
  createButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
