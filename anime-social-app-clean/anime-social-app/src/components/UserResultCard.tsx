import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface UserResult {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
}

interface UserResultCardProps {
  user: UserResult;
  onPress?: () => void;
}

export const UserResultCard: React.FC<UserResultCardProps> = ({ user, onPress }) => {
  const { theme } = useTheme();

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={[styles.displayName, { color: theme.colors.text }]}>
          {user.displayName}
        </Text>
        <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
          @{user.username}
        </Text>
        <Text style={[styles.followers, { color: theme.colors.textSecondary }]}>
          {formatFollowers(user.followers)} followers
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    marginBottom: 2,
  },
  followers: {
    fontSize: 12,
  },
});
