import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  Modal,
  Image,
  Alert,
} from 'react-native';
import {
  Card,
  Button,
  Text,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';


const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3;

const PhotoGalleryScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/photos');
        if (!response.ok) throw new Error('Failed to fetch photos');
        
        const data = await response.json();
        console.log('Fetched photos:', data);
        
        if (data.data && Array.isArray(data.data.photos)) {
          const formattedPhotos = data.data.photos.map((photo) => ({
            id: photo._id || photo.filename,
            url: `http://localhost:5000/uploads/photos/${photo.filename}`,
            title: photo.originalname?.split('.')[0] || 'Photo',
          }));
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        Alert.alert('Error', 'Failed to load photos from server');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleUploadPhoto = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to grant media library permissions to upload photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) return;
      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No image selected');
        return;
      }

      const asset = result.assets[0];
      await uploadToServer(asset);
    } catch (err) {
      console.error('Error picking photo:', err);
      Alert.alert('Error', 'Failed to select photo: ' + err.message);
    }
  };

  const uploadToServer = async (asset) => {
    try {
      setUploading(true);
      const formData = new FormData();
      
      // Append file with proper URI format for React Native
      formData.append('photo', {
        uri: asset.uri,
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      });

      const response = await fetch('http://localhost:5000/api/photos/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      // Add new photo to gallery
      if (data.data && data.data.photos && data.data.photos.length > 0) {
        const newPhoto = {
          id: data.data.photos[0]._id || Date.now(),
          url: `http://localhost:5000/uploads/photos/${data.data.photos[0].filename}`,
          title: data.data.photos[0].originalname?.split('.')[0] || 'New Photo',
        };
        setPhotos((prev) => [newPhoto, ...prev]);
      }

      Alert.alert('Success', '📷 Image uploaded successfully');
      setUploading(false);
    } catch (error) {
      Alert.alert('Upload Error', error.message || 'Failed to upload image');
      setUploading(false);
    }
  };



  const renderPhotoGrid = ({ item }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => {
        setSelectedImage(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.photo}
      />
      <View style={styles.photoOverlay}>
        <Icon name="magnify-plus" size={24} color="#FFFFFF" />
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
          <Text style={styles.headerTitle}>Photo Gallery</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Upload Button */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUploadPhoto}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="cloud-upload" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload New Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <Card style={styles.infoBanner}>
        <View style={styles.infoBannerContent}>
          <Icon name="information" size={20} color="#45B7D1" />
          <Text style={styles.infoBannerText}>Tap on any image to view full size</Text>
        </View>
      </Card>

      {/* Photos Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Icon name="image-outline" size={48} color="#999" />
          <Text style={styles.loadingText}>No photos in gallery</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoGrid}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: selectedImage.url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <View style={styles.imageInfo}>
                <Text style={styles.imageTitle}>{selectedImage.title}</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="download" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="share" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>


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
  infoBanner: {
    marginHorizontal: 12,
    marginVertical: 12,
    backgroundColor: '#E8F4F8',
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  infoBannerText: {
    fontSize: 12,
    color: '#45B7D1',
    fontWeight: '500',
  },
  uploadSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#5E35B1',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  photoItem: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    padding: 8,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fullImage: {
    width: '100%',
    height: '70%',
  },
  imageInfo: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionButton: {
    padding: 12,
    backgroundColor: '#FFFFFF22',
    borderRadius: 30,
  },


});

export default PhotoGalleryScreen;
