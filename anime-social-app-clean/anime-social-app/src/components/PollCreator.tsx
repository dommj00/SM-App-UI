import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface PollData {
  options: string[];
  endsInDays: number;
}

interface PollCreatorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (poll: PollData) => void;
  initialPoll?: PollData | null;
}

export const PollCreator: React.FC<PollCreatorProps> = ({
  visible,
  onClose,
  onSave,
  initialPoll,
}) => {
  const { theme } = useTheme();
  const [options, setOptions] = useState<string[]>(
    initialPoll?.options || ['', '']
  );
  const [endsInDays, setEndsInDays] = useState(initialPoll?.endsInDays || 1);

  const durationOptions = [1, 2, 3, 5, 7];

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSave = () => {
    const filledOptions = options.filter((o) => o.trim() !== '');
    if (filledOptions.length >= 2) {
      onSave({ options: filledOptions, endsInDays });
      onClose();
    }
  };

  const canSave = options.filter((o) => o.trim() !== '').length >= 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>Create Poll</Text>
            <TouchableOpacity onPress={handleSave} disabled={!canSave}>
              <Text
                style={[
                  styles.saveText,
                  { color: canSave ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
              Options ({options.length}/4)
            </Text>

            {options.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <TextInput
                  style={[
                    styles.optionInput,
                    {
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor={theme.colors.textSecondary}
                  value={option}
                  onChangeText={(text) => updateOption(index, text)}
                  maxLength={50}
                />
                {options.length > 2 && (
                  <TouchableOpacity
                    onPress={() => removeOption(index)}
                    style={styles.removeButton}
                  >
                    <Text style={[styles.removeText, { color: theme.colors.textSecondary }]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {options.length < 4 && (
              <TouchableOpacity
                style={[styles.addButton, { borderColor: theme.colors.border }]}
                onPress={addOption}
              >
                <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
                  + Add Option
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary, marginTop: 24 }]}>
              Poll Duration
            </Text>

            <View style={styles.durationContainer}>
              {durationOptions.map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.durationButton,
                    {
                      backgroundColor:
                        endsInDays === days ? theme.colors.primary : theme.colors.background,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setEndsInDays(days)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      { color: endsInDays === days ? '#FFFFFF' : theme.colors.text },
                    ]}
                  >
                    {days}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
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
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  removeButton: {
    padding: 12,
    marginLeft: 8,
  },
  removeText: {
    fontSize: 18,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
