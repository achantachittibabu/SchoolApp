import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockBookRequests } from '../utils/mockLibraryData';

const BookTrackingScreen = ({ navigation, route }) => {
  const [book, setBook] = useState(null);
  const [bookRequests, setBookRequests] = useState([]);

  useEffect(() => {
    if (route.params?.selectedBook) {
      const selectedBook = route.params.selectedBook;
      setBook(selectedBook);

      // Filter requests for this specific book
      const filteredRequests = mockBookRequests.filter(
        (request) => request.bookNumber === selectedBook.bookNumber
      );
      setBookRequests(filteredRequests);
    }
  }, [route.params]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'approved':
        return 'check-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderRequestItem = ({ item }) => (
    <Card style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.studentInfo}>
            <Icon name="account" size={24} color="#2196F3" />
            <View style={styles.studentTextContainer}>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.studentId}>{item.studentId}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Icon name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
            <Text style={[styles.badgeText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={18} color="#9C27B0" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Request Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.requestDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar-check" size={18} color="#4CAF50" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Requested Return By</Text>
              <Text style={styles.detailValue}>{formatDate(item.requestedReturnDate)}</Text>
            </View>
          </View>
        </View>

        {item.status === 'rejected' && item.rejectionReason && (
          <View style={styles.rejectionContainer}>
            <Icon name="alert-circle" size={18} color="#F44336" />
            <View style={styles.rejectionTextContainer}>
              <Text style={styles.rejectionLabel}>Rejection Reason</Text>
              <Text style={styles.rejectionReason}>{item.rejectionReason}</Text>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const pendingCount = bookRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = bookRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = bookRequests.filter((r) => r.status === 'rejected').length;

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Book Request Tracking</Title>
              <Text style={styles.headerSubtitle}>Track all requests for this book</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="book-open-page-variant" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Book Details Card */}
      <Card style={styles.bookCard}>
        <Card.Content>
          <Text style={styles.bookTitle}>{book.bookName}</Text>
          <Text style={styles.bookNumber}>{book.bookNumber}</Text>
          <Divider style={styles.divider} />
          <View style={styles.bookDetailsRow}>
            <View style={styles.bookDetailItem}>
              <Text style={styles.bookDetailLabel}>Author</Text>
              <Text style={styles.bookDetailValue}>{book.author}</Text>
            </View>
            <View style={styles.bookDetailItem}>
              <Text style={styles.bookDetailLabel}>Subject</Text>
              <Text style={styles.bookDetailValue}>{book.subject}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="clock-outline" size={20} color="#FF9800" />
              <Text style={[styles.statValue, { color: '#FF9800' }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>{approvedCount}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="close-circle" size={20} color="#F44336" />
              <Text style={[styles.statValue, { color: '#F44336' }]}>{rejectedCount}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Requests List */}
      <ScrollView style={styles.requestsContainer}>
        {bookRequests.length > 0 ? (
          <FlatList
            data={bookRequests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No requests for this book</Text>
          </View>
        )}
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Back to Library</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
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
  bookCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  bookNumber: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  bookDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  bookDetailItem: {
    flex: 1,
  },
  bookDetailLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  bookDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  statsCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  requestsContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  requestCard: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  studentTextContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  studentId: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  requestDetailRow: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  rejectionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
  },
  rejectionTextContainer: {
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 11,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 2,
  },
  rejectionReason: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 12,
  },
});

export default BookTrackingScreen;
