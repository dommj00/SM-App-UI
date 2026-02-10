import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface DiscardConfirmModalProps {
  visible: boolean;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

export const DiscardConfirmModal: React.FC<DiscardConfirmModalProps> = ({
  visible,
  onDiscard,
  onKeepEditing,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onKeepEditing}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Discard post?
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            You have unsaved changes. Are you sure you want to discard this post?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.keepButton, { borderColor: theme.colors.border }]}
              onPress={onKeepEditing}
            >
              <Text style={[styles.keepButtonText, { color: theme.colors.text }]}>
                Keep Editing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.discardButton, { backgroundColor: theme.colors.primary }]}
              onPress={onDiscard}
            >
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modal: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  keepButton: {
    borderWidth: 1,
  },
  keepButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  discardButton: {},
  discardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
