import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { FeedHeader } from '../components/FeedHeader';
import { RecommendationCard } from '../components/RecommendationCard';
import { PostCard } from '../components/PostCard';
import { Post, Recommendation, FeedFilter } from '../types';
import mockPosts from '../data/mockPosts.json';
import mockRecommendations from '../data/mockRecommendations.json';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('discover');
  const [posts, setPosts] = useState<Post[]>(mockPosts as Post[]);
  const [recommendations] = useState<Recommendation[]>(mockRecommendations as Recommendation[]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setPosts([...mockPosts] as Post[]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    // Simulate loading more posts
    setTimeout(() => {
      const morePosts = mockPosts.map((post, index) => ({
        ...post,
        id: `${post.id}-more-${Date.now()}-${index}`,
      })) as Post[];
      setPosts((prev) => [...prev, ...morePosts]);
      setLoadingMore(false);
    }, 1500);
  }, [loadingMore]);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );
  };

  const renderHeader = () => (
    <View>
      <FeedHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      {/* Recommendations Section */}
      <View style={[styles.recommendationsContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recommended for You
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendationsList}
        >
          {recommendations.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              onPress={() => console.log('Recommendation pressed:', item.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Feed Label */}
      <View style={[styles.feedLabel, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.feedLabelText, { color: theme.colors.textSecondary }]}>
          Latest Posts
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => handleLike(item.id)}
            onComment={() => console.log('Comment:', item.id)}
            onShare={() => console.log('Share:', item.id)}
            onBookmark={() => handleBookmark(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recommendationsContainer: {
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  recommendationsList: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  feedLabel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedLabelText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
});
