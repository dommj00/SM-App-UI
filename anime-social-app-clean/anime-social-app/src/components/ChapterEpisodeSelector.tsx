import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SectionList,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import contentDetailsData from '../data/mockContentDetails.json';

interface SelectedChapterEpisode {
  id: string;
  number: number;
  title: string;
  season?: number;
  volume?: number;
}

interface ChapterEpisodeSelectorProps {
  visible: boolean;
  contentId: string;
  contentType: 'anime' | 'manga' | 'book';
  onClose: () => void;
  onSelect: (item: SelectedChapterEpisode) => void;
}

export const ChapterEpisodeSelector: React.FC<ChapterEpisodeSelectorProps> = ({
  visible,
  contentId,
  contentType,
  onClose,
  onSelect,
}) => {
  const { theme } = useTheme();

  const isAnime = contentType === 'anime';
  const label = isAnime ? 'Episode' : 'Chapter';

  const content = useMemo(() => {
    return contentDetailsData.content.find((c) => c.id === contentId);
  }, [contentId]);

  const sections = useMemo(() => {
    if (!content) return [];

    if (isAnime && content.episodes) {
      const grouped: { [key: number]: any[] } = {};
      content.episodes.forEach((ep: any) => {
        const season = ep.season || 1;
        if (!grouped[season]) grouped[season] = [];
        grouped[season].push(ep);
      });

      return Object.keys(grouped).map((season) => ({
        title: `Season ${season}`,
        data: grouped[parseInt(season)],
      }));
    } else if (content.chapters) {
      const grouped: { [key: number]: any[] } = {};
      content.chapters.forEach((ch: any) => {
        const volume = ch.volume || 1;
        if (!grouped[volume]) grouped[volume] = [];
        grouped[volume].push(ch);
      });

      return Object.keys(grouped).map((volume) => ({
        title: `Volume ${volume}`,
        data: grouped[parseInt(volume)],
      }));
    }

    return [];
  }, [content, isAnime]);

  const handleSelect = (item: any) => {
    onSelect({
      id: item.id,
      number: item.number,
      title: item.title,
      season: item.season,
      volume: item.volume,
    });
    onClose();
  };

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
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Select {label}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {sections.length > 0 ? (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderSectionHeader={({ section }) => (
                <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    {section.title}
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.itemRow, { borderBottomColor: theme.colors.border }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.itemNumber, { color: theme.colors.primary }]}>
                    {isAnime ? 'Ep' : 'Ch'} {item.number}
                  </Text>
                  <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No {label.toLowerCase()}s available
              </Text>
            </View>
          )}
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
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 50,
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '600',
    width: 50,
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
});
