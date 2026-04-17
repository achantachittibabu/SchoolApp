import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeleteBookScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    if (route.params?.selectedBook) {
      setSelectedBook(route.params.selectedBook);
    } else {
      Alert.alert(
        'No Book Selected',
        'Please select a book to delete',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [route.params]);

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${selectedBook.bookName}" (${selectedBook.bookNumber})?\n\nThis action cannot be undone.`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              // API call would go here
              // const response = await axios.delete(`http://localhost:5000/api/library/${selectedBook.id}`);

              // For now, just show success
              Alert.alert(
                'Success',
                `Book "${selectedBook.bookName}" deleted successfully!`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book. Please try again.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!selectedBook) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Warning Header Card */}
      <Card style={styles.warningHeaderCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Delete Book</Title>
              <Text style={styles.headerSubtitle}>Permanent action - cannot be undone</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="alert-circle" size={40} color="#F44336" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Book Details Card */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Book Details</Text>
          <Divider style={styles.divider} />

          {/* Book Information Grid */}
          <View style={styles.detailGrid}>
            {/* Book Number */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="key" size={18} color="#2196F3" />
                <Text style={styles.label}>Book Number</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.bookNumber}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Book Name */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="book" size={18} color="#2196F3" />
                <Text style={styles.label}>Book Name</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.bookName}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Subject */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="tag" size={18} color="#2196F3" />
                <Text style={styles.label}>Subject</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.subject}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Author */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="account" size={18} color="#2196F3" />
                <Text style={styles.label}>Author</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.author}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* ISBN */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="barcode" size={18} color="#2196F3" />
                <Text style={styles.label}>ISBN</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.isbn}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Publisher */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="office-building" size={18} color="#2196F3" />
                <Text style={styles.label}>Publisher</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.publisher}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Year */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="calendar" size={18} color="#2196F3" />
                <Text style={styles.label}>Publication Year</Text>
              </View>
              <Text style={styles.detailValue}>{selectedBook.year}</Text>
            </View>

            <Divider style={styles.gridDivider} />

            {/* Availability */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Icon name="check-circle" size={18} color="#2196F3" />
                <Text style={styles.label}>Availability</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: selectedBook.available ? '#E8F5E9' : '#FFEBEE',
                  },
                ]}
              >
                <Icon
                  name={selectedBook.available ? 'check-circle' : 'close-circle'}
                  size={14}
                  color={selectedBook.available ? '#4CAF50' : '#F44336'}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: selectedBook.available ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {selectedBook.available ? 'Available' : 'Not Available'}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Warning Message Card */}
      <Card style={styles.warningCard}>
        <Card.Content>
          <View style={styles.warningContent}>
            <Icon name="alert" size={24} color="#F44336" />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Warning</Text>
              <Text style={styles.warningText}>
                Deleting this book will remove it permanently from the library database. This action cannot be reversed.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Card.Content>
          <Text style={styles.actionTitle}>Actions</Text>
          <Divider style={styles.divider} />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={loading}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Icon name="delete" size={20} color="#fff" />
              <Text style={styles.buttonText}>Delete Book</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              disabled={loading}
              style={[styles.actionButton, styles.cancelButton]}
            >
              <Icon name="close" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  warningHeaderCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#FFEBEE',
    borderRadius: 50,
    padding: 12,
  },
  detailCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  detailGrid: {
    gap: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 0.4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    flex: 0.6,
    textAlign: 'right',
  },
  gridDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  warningCard: {
    marginBottom: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  warningContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#D32F2F',
    lineHeight: 18,
  },
  actionCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 20,
  },
});

export default DeleteBookScreen;
