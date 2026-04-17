import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Menu,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { mockBooksData } from '../utils/mockLibraryData';

const LibraryScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [booksData, setBooksData] = useState(mockBooksData);
  const [filteredBooks, setFilteredBooks] = useState(mockBooksData);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedBookForAction, setSelectedBookForAction] = useState(null);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
  }, [route.params]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/library');
      setBooksData(response.data.data || mockBooksData);
    } catch (error) {
      // Use mock data from mockLibraryData
      setBooksData(mockBooksData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on availability
  useEffect(() => {
    const dataToFilter = booksData && booksData.length > 0 ? booksData : mockBooksData;
    
    if (selectedFilter === 'all') {
      setFilteredBooks(dataToFilter);
    } else if (selectedFilter === 'available') {
      setFilteredBooks(dataToFilter.filter((book) => book.available === true));
    } else if (selectedFilter === 'notavailable') {
      setFilteredBooks(dataToFilter.filter((book) => book.available === false));
    } else {
      setFilteredBooks(dataToFilter);
    }
  }, [selectedFilter, booksData]);

  const handleAddBook = () => {
    navigation.navigate('AddBook', { userData: user });
  };

  const handleUpdateBook = () => {
    if (!selectedBookForAction) {
      Alert.alert('Select Book', 'Please select a book to update');
      return;
    }
    navigation.navigate('UpdateBook', { userData: user, selectedBook: selectedBookForAction });
  };

  const handleDeleteBook = () => {
    if (!selectedBookForAction) {
      Alert.alert('Select Book', 'Please select a book to delete');
      return;
    }
    navigation.navigate('DeleteBook', { userData: user, selectedBook: selectedBookForAction });
  };

  const handleBookTracking = () => {
    if (!selectedBookForAction) {
      Alert.alert('Select Book', 'Please select a book to view tracking history');
      return;
    }
    navigation.navigate('BookTracking', { userData: user, selectedBook: selectedBookForAction });
  };

  // Helper function to safely get counts
  const getBooksCounts = () => {
    const dataToCount = booksData && Array.isArray(booksData) && booksData.length > 0 ? booksData : mockBooksData;
    const totalCount = dataToCount ? dataToCount.length : 0;
    const availableCount = dataToCount ? dataToCount.filter((b) => b.available === true).length : 0;
    const notAvailableCount = dataToCount ? dataToCount.filter((b) => b.available === false).length : 0;
    
    return {
      total: totalCount,
      available: availableCount,
      notAvailable: notAvailableCount,
    };
  };

  const renderBookRow = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedBookForAction(selectedBookForAction?.id === item.id ? null : item)}
      style={[
        styles.tableRow,
        selectedBookForAction?.id === item.id && styles.tableRowSelected,
      ]}
    >
      <View style={styles.selectCheckbox}>
        {selectedBookForAction?.id === item.id && (
          <Icon name="check-circle" size={20} color="#2196F3" />
        )}
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.bookNumber}
        </Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.cellTextBold} numberOfLines={1}>
          {item.bookName}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.forClass || 'N/A'}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.subject}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: item.available ? '#E8F5E9' : '#FFEBEE',
            },
          ]}
        >
          <Icon
            name={item.available ? 'check-circle' : 'close-circle'}
            size={16}
            color={item.available ? '#4CAF50' : '#F44336'}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.available ? '#4CAF50' : '#F44336' },
            ]}
          >
            {item.available ? 'Available' : 'Not Available'}
          </Text>
        </View>
      </View>
      <View style={styles.actionCellButtons}>
        {item.available ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('RequestBook', { book: item, userData: user })}
            style={[styles.rowButton, styles.requestButton]}
          >
            <Icon name="hand-right" size={16} color="#fff" />
            <Text style={styles.rowButtonText}>Request</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('BookStatus', { book: item })}
            style={[styles.rowButton, styles.statusButton]}
          >
            <Icon name="information" size={16} color="#fff" />
            <Text style={styles.rowButtonText}>Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Library Management</Title>
              <Text style={styles.headerSubtitle}>Manage and track all library books</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="library-shelves" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filter Card */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <View style={styles.filterHeader}>
            <Icon name="filter" size={20} color="#2196F3" />
            <Text style={styles.filterTitle}>Filter Books</Text>
            <View style={styles.headerButtonsGroup}>
              <TouchableOpacity
                onPress={() => navigation.navigate('BookOverdue')}
                style={[styles.headerButton, styles.overdueButton]}
              >
                <Icon name="alert-circle" size={16} color="#fff" />
                <Text style={styles.headerButtonText}>Over Due Requests</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('BookRequests')}
                style={[styles.headerButton, styles.approvalsButton]}
              >
                <Icon name="clipboard-list" size={16} color="#fff" />
                <Text style={styles.headerButtonText}>Approvals Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyRequests')}
                style={[styles.headerButton, styles.myRequestsButton]}
              >
                <Icon name="clipboard-check" size={16} color="#fff" />
                <Text style={styles.headerButtonText}>My Requests</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Availability Status</Text>
            <Menu
              visible={showFilterMenu}
              onDismiss={() => setShowFilterMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowFilterMenu(true)}
                  style={styles.filterButton}
                >
                  <Icon name="chevron-down" size={18} color="#2196F3" />
                  <Text style={styles.filterButtonText}>
                    {selectedFilter === 'all'
                      ? 'All Books'
                      : selectedFilter === 'available'
                      ? 'Available'
                      : 'Not Available'}
                  </Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSelectedFilter('all');
                  setShowFilterMenu(false);
                }}
                title="All Books"
                leadingIcon="library-shelves"
              />
              <Menu.Item
                onPress={() => {
                  setSelectedFilter('available');
                  setShowFilterMenu(false);
                }}
                title="Available"
                leadingIcon="check-circle"
              />
              <Menu.Item
                onPress={() => {
                  setSelectedFilter('notavailable');
                  setShowFilterMenu(false);
                }}
                title="Not Available"
                leadingIcon="close-circle"
              />
            </Menu>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="book-multiple" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{getBooksCounts().total}</Text>
              <Text style={styles.statLabel}>Total Books</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>
                {getBooksCounts().available}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="close-circle" size={24} color="#F44336" />
              <Text style={styles.statValue}>
                {getBooksCounts().notAvailable}
              </Text>
              <Text style={styles.statLabel}>Not Available</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Books Table Card */}
      <Card style={styles.tableCard}>
        <Card.Content>
          <View style={styles.tableHeader}>
            <View style={styles.selectCheckbox}>
              <Text style={styles.headerText}></Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Book #</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text style={styles.headerText}>Book Name</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>For Class</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Subject</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Status</Text>
            </View>
            <View style={styles.actionCellButtons}>
              <Text style={styles.headerText}>Action</Text>
            </View>
          </View>

          <Divider style={styles.tableDivider} />

          {/* Debug Info */}
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            Filtered: {filteredBooks?.length || 0} | Total: {booksData?.length || 0} | Filter: {selectedFilter}
          </Text>

          {/* Sample Data Debug */}
          {filteredBooks && filteredBooks.length > 0 && (
            <Text style={{ fontSize: 11, color: '#999', marginBottom: 8, fontStyle: 'italic' }}>
              First book: {filteredBooks[0]?.bookName}
            </Text>
          )}

          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : filteredBooks && filteredBooks.length > 0 ? (
            <FlatList
              data={filteredBooks}
              renderItem={renderBookRow}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="inbox" size={48} color="#ccc" />
              <Text style={styles.noDataText}>No books found</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Card.Content>
          <Text style={styles.actionTitle}>Actions</Text>
          <Divider style={styles.divider} />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleAddBook}
              style={[styles.actionButton, styles.addButton]}
            >
              <Icon name="plus-circle" size={24} color="#fff" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Add Book to Library</Text>
                <Text style={styles.buttonSubtext}>Add new book</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUpdateBook}
              style={[styles.actionButton, styles.updateButton]}
            >
              <Icon name="pencil-circle" size={24} color="#fff" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Update Book</Text>
                <Text style={styles.buttonSubtext}>Edit selected book</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteBook}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Icon name="delete-circle" size={24} color="#fff" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Delete Book</Text>
                <Text style={styles.buttonSubtext}>Remove selected book</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBookTracking}
              style={[styles.actionButton, styles.trackingButton]}
            >
              <Icon name="history" size={24} color="#fff" />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>View Book Tracking</Text>
                <Text style={styles.buttonSubtext}>Request history</Text>
              </View>
            </TouchableOpacity>
          </View>

          {selectedBookForAction && (
            <View style={styles.selectedInfo}>
              <Icon name="information" size={18} color="#2196F3" />
              <Text style={styles.selectedInfoText}>
                Selected: {selectedBookForAction.bookName}
              </Text>
            </View>
          )}
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
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    padding: 12,
  },
  filterCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  overdueButton: {
    backgroundColor: '#F44336',
  },
  approvalsButton: {
    backgroundColor: '#FF9800',
  },
  myRequestsButton: {
    backgroundColor: '#4CAF50',
  },
  headerButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    gap: 8,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  tableCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  selectCheckbox: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#2196F3',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tableRowSelected: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  cellText: {
    fontSize: 13,
    color: '#666',
  },
  cellTextBold: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
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
  rowSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  tableDivider: {
    marginBottom: 8,
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
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
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 12,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  trackingButton: {
    backgroundColor: '#9C27B0',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    gap: 8,
  },
  selectedInfoText: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  actionCellButtons: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
  },
  statusButton: {
    backgroundColor: '#FF9800',
  },
  rowButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});

export default LibraryScreen;
