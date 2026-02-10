import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { UserResultCard } from '../components/UserResultCard';
import { ContentResultCard } from '../components/ContentResultCard';
import { RecommendationCard } from '../components/RecommendationCard';
import searchData from '../data/mockSearchData.json';

type SearchResult = {
  type: 'user' | 'content';
  data: any;
};

interface SearchScreenProps {
  onClose?: () => void;
  onContentPress?: (contentId: string) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onClose, onContentPress }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Get content by IDs for sections
  const getTrendingContent = () =>
    searchData.trending
      .map((id) => searchData.content.find((c) => c.id === id))
      .filter(Boolean);

  const getPopularContent = () =>
    searchData.popular
      .map((id) => searchData.content.find((c) => c.id === id))
      .filter(Boolean);

  const getRecommendedContent = () =>
    searchData.recommended
      .map((id) => searchData.content.find((c) => c.id === id))
      .filter(Boolean);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search users
    const matchedUsers = searchData.users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.displayName.toLowerCase().includes(query)
    );
    matchedUsers.forEach((user) => results.push({ type: 'user', data: user }));

    // Search content
    const matchedContent = searchData.content.filter((content) =>
      content.title.toLowerCase().includes(query)
    );
    matchedContent.forEach((content) => results.push({ type: 'content', data: content }));

    return results;
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'content' && onContentPress) {
      onContentPress(result.data.id);
    } else if (result.type === 'user') {
      console.log('User selected:', result.data.displayName);
      // TODO: Navigate to user profile
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    if (item.type === 'user') {
      return <UserResultCard user={item.data} onPress={() => handleResultPress(item)} />;
    } else {
      return <ContentResultCard content={item.data} onPress={() => handleResultPress(item)} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Search</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search anime, manga, books, users..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={[styles.clearIcon, { color: theme.colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results or Discovery Sections */}
      {searchQuery.trim() ? (
        // Show search results
        <View style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            <>
              <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item, index) => `${item.type}-${item.data.id}-${index}`}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.noResults}>
              <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
                No results found for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      ) : (
        // Show discovery sections
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Trending Now */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Trending Now
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
              {getTrendingContent().map((item: any) => (
                <RecommendationCard
                  key={item.id}
                  item={{
                    ...item,
                    reviewCount: Math.floor(Math.random() * 50000) + 10000,
                  }}
                  onPress={() => onContentPress && onContentPress(item.id)}  
                />
              ))}
            </ScrollView>
          </View>

          {/* Popular This Week */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular This Week
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
              {getPopularContent().map((item: any) => (
                <RecommendationCard
                  key={item.id}
                  item={{
                    ...item,
                    reviewCount: Math.floor(Math.random() * 50000) + 10000,
                  }}
                  onPress={() => onContentPress && onContentPress(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Recommended For You */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recommended For You
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
              {getRecommendedContent().map((item: any) => (
                <RecommendationCard
                  key={item.id}
                  item={{
                    ...item,
                    reviewCount: Math.floor(Math.random() * 50000) + 10000,
                  }}
                  onPress={() => onContentPress && onContentPress(item.id)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  horizontalList: {
    paddingLeft: 16,
  },
});
