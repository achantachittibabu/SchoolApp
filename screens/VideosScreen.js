import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  Text,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const VideosScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample YouTube playlist videos
  const sampleVideos = [
    {
      id: 1,
      title: 'School Annual Function 2024',
      thumbnail: 'https://images.unsplash.com/photo-1516321370467-5e86cf2d9739?w=300&h=200&fit=crop',
      duration: '15:42',
      views: '2.5K',
      date: '2024-12-15',
    },
    {
      id: 2,
      title: 'Science Fair Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1533928298208-27ff66555d0d?w=300&h=200&fit=crop',
      duration: '8:30',
      views: '1.8K',
      date: '2024-12-10',
    },
    {
      id: 3,
      title: 'Sports Day 2024',
      thumbnail: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=200&fit=crop',
      duration: '22:15',
      views: '4.2K',
      date: '2024-12-05',
    },
    {
      id: 4,
      title: 'Graduation Ceremony',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1601bc27a24f?w=300&h=200&fit=crop',
      duration: '45:00',
      views: '5.1K',
      date: '2024-11-28',
    },
    {
      id: 5,
      title: 'Cultural Program Showcase',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
      duration: '18:45',
      views: '3.2K',
      date: '2024-11-20',
    },
    {
      id: 6,
      title: 'Debate Competition Final Round',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
      duration: '12:30',
      views: '2.1K',
      date: '2024-11-15',
    },
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setVideos(sampleVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity style={styles.videoCard} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Card.Cover
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.playButtonOverlay}>
          <Icon name="play-circle" size={50} color="#FF6B6B" />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.videoStats}>
          <View style={styles.statItem}>
            <Icon name="eye" size={14} color="#999" />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="calendar" size={14} color="#999" />
            <Text style={styles.statText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      {/* Header */}
      <View style={[styles.header, styles.headerBackground]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>School Videos</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <Card style={styles.filterChip}>
          <Text style={styles.filterChipText}>All Videos</Text>
        </Card>
        <Card style={[styles.filterChip, { marginLeft: 8 }]}>
          <Text style={styles.filterChipText}>Recent</Text>
        </Card>
        <Card style={[styles.filterChip, { marginLeft: 8 }]}>
          <Text style={styles.filterChipText}>Popular</Text>
        </Card>
        <Card style={[styles.filterChip, { marginLeft: 8, marginRight: 16 }]}>
          <Text style={styles.filterChipText}>Trending</Text>
        </Card>
      </ScrollView>

      {/* Videos List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          numColumns={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackground: {
    backgroundColor: '#1A237E',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginLeft: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A237E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#000000CC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
    lineHeight: 20,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#999999',
  },
});

export default VideosScreen;
