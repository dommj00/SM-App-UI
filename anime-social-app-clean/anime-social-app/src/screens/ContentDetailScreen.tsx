import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { EpisodeChapterCard } from '../components/EpisodeChapterCard';
import { ActionModal } from '../components/ActionModal';
import { MenuModal } from '../components/MenuModal';
import contentDetailsData from '../data/mockContentDetails.json';

interface ContentDetailScreenProps {
  contentId: string;
  onClose: () => void;
}

type TabType = 'episodes' | 'chapters' | 'reviews' | 'info';

export const ContentDetailScreen: React.FC<ContentDetailScreenProps> = ({
  contentId,
  onClose,
}) => {
  const { theme } = useTheme();
  
  // Find content by ID
  const content = useMemo(() => {
    return contentDetailsData.content.find((c) => c.id === contentId);
  }, [contentId]);

  const isAnime = content?.type === 'anime';
  const isBook = content?.type === 'book';
  const isManga = content?.type === 'manga';

  const [activeTab, setActiveTab] = useState<TabType>(isAnime ? 'episodes' : 'chapters');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(content?.status || null);
  const [inLibrary, setInLibrary] = useState(content?.inLibrary || false);

  if (!content) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Content not found
          </Text>
        </View>
      </View>
    );
  }

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getStatusOptions = () => {
    if (isAnime) {
      return ['Watching', 'Completed', 'Plan to Watch', 'Dropped'];
    }
    return ['Reading', 'Completed', 'Plan to Read', 'Dropped'];
  };

  const getTypeLabel = () => {
    if (isAnime) return `Anime • ${content.seasons} Season${content.seasons !== 1 ? 's' : ''}`;
    if (isManga) return `Manga • ${content.volumes} Volumes`;
    return `Book • ${content.pages} Pages`;
  };

  const getTabs = (): { key: TabType; label: string }[] => {
    if (isAnime) {
      return [
        { key: 'episodes', label: 'Episodes' },
        { key: 'reviews', label: 'Reviews' },
        { key: 'info', label: 'Info' },
      ];
    }
    return [
      { key: 'chapters', label: 'Chapters' },
      { key: 'reviews', label: 'Reviews' },
      { key: 'info', label: 'Info' },
    ];
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${content.title} on our app!`,
        title: content.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleEpisodePress = (episode: any) => {
    setSelectedEpisode(episode);
    setShowActionModal(true);
  };

  const handleAddToLibrary = () => {
    setInLibrary(!inLibrary);
    console.log(inLibrary ? 'Removed from library' : 'Added to library');
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus === status ? null : newStatus);
    if (!inLibrary && newStatus) {
      setInLibrary(true);
    }
    console.log('Status changed to:', newStatus);
  };

  // Group episodes by season
  const groupedEpisodes = useMemo(() => {
    if (!content.episodes) return {};
    return content.episodes.reduce((acc: any, ep: any) => {
      const season = ep.season || 1;
      if (!acc[season]) acc[season] = [];
      acc[season].push(ep);
      return acc;
    }, {});
  }, [content.episodes]);

  // Group chapters by volume (for manga)
  const groupedChapters = useMemo(() => {
    if (!content.chapters) return {};
    return content.chapters.reduce((acc: any, ch: any) => {
      const volume = ch.volume || 1;
      if (!acc[volume]) acc[volume] = [];
      acc[volume].push(ch);
      return acc;
    }, {});
  }, [content.chapters]);

  const renderEpisodesTab = () => {
    const grouped = isAnime ? groupedEpisodes : groupedChapters;
    const groupLabel = isAnime ? 'Season' : (isManga ? 'Volume' : 'Part');

    return (
      <View style={styles.tabContent}>
        {Object.keys(grouped).map((groupKey) => (
          <View key={groupKey} style={styles.seasonSection}>
            <Text style={[styles.seasonTitle, { color: theme.colors.text }]}>
              {groupLabel} {groupKey}
            </Text>
            {grouped[groupKey].map((item: any) => (
              <EpisodeChapterCard
                key={item.id}
                id={item.id}
                number={item.number}
                title={item.title}
                rating={item.rating}
                reviewCount={item.reviewCount}
                isCompleted={isAnime ? item.watched : item.read}
                userRating={item.userRating}
                isAnime={isAnime}
                onPress={() => handleEpisodePress(item)}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderReviewsTab = () => (
    <View style={styles.placeholderTab}>
      <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
        Reviews coming soon
      </Text>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.infoTab}>
      <View style={styles.infoSection}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Synopsis</Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>{content.synopsis}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Genres</Text>
        <View style={styles.genreContainer}>
          {content.genres?.map((genre: string, index: number) => (
            <View key={index} style={[styles.genreTag, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.genreText, { color: theme.colors.primary }]}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Release Year</Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>{content.releaseYear}</Text>
      </View>

      {content.studio && (
        <View style={styles.infoSection}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Studio</Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>{content.studio}</Text>
        </View>
      )}

      {content.author && (
        <View style={styles.infoSection}>
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Author</Text>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>{content.author}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowMenuModal(true)} style={styles.headerButton}>
            <Text style={[styles.headerIcon, { color: theme.colors.text }]}>⋮</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Text style={[styles.headerIcon, { color: theme.colors.text }]}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Art */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: content.coverImage }} style={styles.coverImage} />
        </View>

        {/* Title & Type */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{content.title}</Text>
          <Text style={[styles.typeLabel, { color: theme.colors.textSecondary }]}>
            {getTypeLabel()}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: inLibrary ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border },
            ]}
            onPress={handleAddToLibrary}
          >
            <Text style={[styles.actionButtonText, { color: inLibrary ? '#FFFFFF' : theme.colors.text }]}>
              {inLibrary ? '✓ In Library' : '➕ Add to Library'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => {
              const options = getStatusOptions();
              const currentIndex = status ? options.indexOf(status) : -1;
              const nextIndex = (currentIndex + 1) % options.length;
              handleStatusChange(options[nextIndex]);
            }}
          >
            <Text style={[styles.statusButtonText, { color: status ? theme.colors.primary : theme.colors.text }]}>
              {status || (isAnime ? 'Set Status' : 'Set Status')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={[styles.ratingText, { color: theme.colors.text }]}>
            ⭐ {content.rating}/5 • {formatCount(content.reviewCount)} reviews
          </Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: theme.colors.border }]}>
          {getTabs().map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {(activeTab === 'episodes' || activeTab === 'chapters') && renderEpisodesTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
        {activeTab === 'info' && renderInfoTab()}
      </ScrollView>

      {/* Action Modal */}
      <ActionModal
        visible={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={selectedEpisode?.title || ''}
        subtitle={isAnime ? `Episode ${selectedEpisode?.number}` : `Chapter ${selectedEpisode?.number}`}
        isAnime={isAnime}
        onRate={() => console.log('Rate:', selectedEpisode?.id)}
        onReview={() => console.log('Review:', selectedEpisode?.id)}
        onMarkComplete={() => console.log('Mark complete:', selectedEpisode?.id)}
      />

      {/* Menu Modal */}
      <MenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        isAnime={isAnime}
        inLibrary={inLibrary}
        onRecommend={() => console.log('Recommend')}
        onAddToLibrary={handleAddToLibrary}
        onMarkComplete={() => console.log('Mark all as complete')}
        onRate={() => console.log('Rate content')}
      />
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerIcon: {
    fontSize: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  coverContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  coverImage: {
    width: 180,
    height: 270,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabContent: {
    paddingBottom: 32,
  },
  seasonSection: {
    marginBottom: 16,
  },
  seasonTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  placeholderTab: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
  },
  infoTab: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
