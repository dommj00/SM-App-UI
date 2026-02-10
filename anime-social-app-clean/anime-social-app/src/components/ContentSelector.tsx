import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import searchData from '../data/mockSearchData.json';

interface SelectedContent {
  id: string;
  title: string;
  type: 'anime' | 'manga' | 'book';
}

interface ContentSelectorProps {
  selectedContent: SelectedContent | null;
  onSelectContent: (content: SelectedContent | null) => void;
}

export const ContentSelector: React.FC<ContentSelectorProps> = ({
  selectedContent,
  onSelectContent,
}) => {
  const { theme } = useTheme();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anime':
        return '📺';
      case 'manga':
        return '📖';
      case 'book':
        return '📚';
      default:
        return '📄';
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchData.content
      .filter((item) => item.title.toLowerCase().includes(query))
      .slice(0, 6);
  }, [searchQuery]);

  const handleSelectResult = (item: any) => {
    onSelectContent({
      id: item.id,
      title: item.title,
      type: item.type,
    });
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleUseCustom = () => {
    if (searchQuery.trim()) {
      onSelectContent({
        id: `custom-${Date.now()}`,
        title: searchQuery.trim(),
        type: 'book', // Default to book for custom entries
      });
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const handleClear = () => {
    onSelectContent(null);
  };

  if (selectedContent) {
    return (
      <View style={[styles.selectedContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={styles.selectedIcon}>{getTypeIcon(selectedContent.type)}</Text>
        <Text style={[styles.selectedTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {selectedContent.title}
        </Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={[styles.clearIcon, { color: theme.colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isSearching) {
    return (
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search anime, manga, books..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}>
            <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {searchQuery.trim() !== '' && (
          <View style={[styles.resultsContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.resultItem, { borderBottomColor: theme.colors.border }]}
                    onPress={() => handleSelectResult(item)}
                  >
                    <Text style={styles.resultIcon}>{getTypeIcon(item.type)}</Text>
                    <View style={styles.resultInfo}>
                      <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.resultType, { color: theme.colors.textSecondary }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.resultsList}
              />
            ) : (
              <View style={styles.noResults}>
                <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
                  No results found
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.useCustomButton, { borderTopColor: theme.colors.border }]}
              onPress={handleUseCustom}
            >
              <Text style={[styles.useCustomText, { color: theme.colors.primary }]}>
                Use "{searchQuery}" as custom title
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.selectButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => setIsSearching(true)}
    >
      <Text style={styles.selectIcon}>📚</Text>
      <Text style={[styles.selectText, { color: theme.colors.textSecondary }]}>
        Select Content (Optional)
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  selectText: {
    fontSize: 15,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  selectedTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
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
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  resultsContainer: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  resultType: {
    fontSize: 12,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
  },
  useCustomButton: {
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  useCustomText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
