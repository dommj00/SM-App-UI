import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  isAnime: boolean;
  inLibrary: boolean;
  onRecommend: () => void;
  onAddToLibrary: () => void;
  onMarkComplete: () => void;
  onRate: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  visible,
  onClose,
  isAnime,
  inLibrary,
  onRecommend,
  onAddToLibrary,
  onMarkComplete,
  onRate,
}) => {
  const { theme } = useTheme();

  const menuItems = [
    { icon: '📤', label: 'Recommend', onPress: onRecommend },
    { icon: inLibrary ? '✓' : '📚', label: inLibrary ? 'In Library' : 'Add to Library', onPress: onAddToLibrary },
    { icon: '✓', label: isAnime ? 'Mark as Watched' : 'Mark as Read', onPress: onMarkComplete },
    { icon: '⭐', label: 'Rate', onPress: onRate },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
              ]}
              onPress={() => {
                item.onPress();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.colors.background }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
