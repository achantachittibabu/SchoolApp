import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
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
import * as DocumentPicker from 'expo-document-picker';

const MenuItemsScreen = ({ navigation }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch menu items from server
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/menuitems');
      if (!response.ok) throw new Error('Failed to fetch menu items');

      const data = await response.json();
      console.log('Fetched menu items:', data);

      if (data.data && Array.isArray(data.data.items)) {
        const formattedFiles = data.data.items.map((item) => ({
          id: item._id || item.filename,
          filename: item.filename,
          originalname: item.originalname || item.filename,
          url: `http://localhost:5000/uploads/menuitems/${item.filename}`,
          uploadedAt: item.uploadedAt || new Date().toISOString(),
        }));
        setFiles(formattedFiles);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      Alert.alert('Error', 'Failed to load menu items from server');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      console.log('Document pick result:', result);

      if (result.canceled) {
        console.log('Document selection cancelled');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No file selected');
        return;
      }

      const asset = result.assets[0];
      await uploadFileToServer(asset);
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', 'Failed to select file: ' + err.message);
    }
  };

  const uploadFileToServer = async (asset) => {
    try {
      setUploading(true);
      const formData = new FormData();

      // Append file with proper URI format for React Native
      formData.append('file', {
        uri: asset.uri,
        name: asset.name || `file_${Date.now()}`,
        type: asset.mimeType || 'application/octet-stream',
      });

      console.log('Uploading file:', asset.name);

      const response = await fetch('http://localhost:5000/api/menuitems/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      console.log('Upload response:', data);

      // Add new file to list
      if (data.data && data.data.items && data.data.items.length > 0) {
        const newFile = {
          id: data.data.items[0]._id || Date.now(),
          filename: data.data.items[0].filename,
          originalname: data.data.items[0].originalname,
          url: `http://localhost:5000/uploads/menuitems/${data.data.items[0].filename}`,
          uploadedAt: data.data.items[0].uploadedAt,
        };
        setFiles((prev) => [newFile, ...prev]);
      }

      Alert.alert('Success', '✅ File uploaded successfully');
      setUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Error', error.message || 'Failed to upload file');
      setUploading(false);
    }
  };

  const deleteFile = async (fileId, filename) => {
    Alert.alert('Delete File', 'Are you sure you want to delete this file?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/menuitems/${fileId}`, {
              method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            Alert.alert('Success', '🗑️ File deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete file: ' + error.message);
          }
        },
      },
    ]);
  };

  const renderFileItem = ({ item }) => (
    <Card style={styles.fileCard}>
      <View style={styles.fileContent}>
        <View style={styles.fileInfo}>
          <Icon name="file-document-outline" size={32} color="#5E35B1" />
          <View style={styles.fileDetails}>
            <Text numberOfLines={1} style={styles.fileName}>{item.originalname}</Text>
            <Text style={styles.fileDate}>
              {new Date(item.uploadedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => deleteFile(item.id, item.filename)}
          style={styles.deleteButton}
        >
          <Icon name="delete-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </Card>
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
          <Text style={styles.headerTitle}>Menu Items</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Upload Button */}
      <View style={styles.uploadSection}>
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUploadFile}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="file-upload" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload Menu File</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Files List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      ) : files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>No menu items uploaded</Text>
          <Text style={styles.emptySubText}>Tap the upload button to add files</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  fileCard: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fileContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
});

export default MenuItemsScreen;
