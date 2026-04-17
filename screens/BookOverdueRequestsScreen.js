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
import { mockBooksData } from '../utils/mockLibraryData';

const BookOverdueRequestsScreen = ({ navigation }) => {
  const [overdueBooks, setOverdueBooks] = useState([]);

  useEffect(() => {
    // Filter books that are not available (assigned) and past their due date
    const today = new Date();
    const filtered = mockBooksData.filter((book) => {
      if (book.available || !book.dueDate) return false;
      const dueDate = new Date(book.dueDate);
      return dueDate < today;
    });
    setOverdueBooks(filtered);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderBookItem = ({ item }) => {
    const daysOverdue = getDaysOverdue(item.dueDate);
    return (
      <Card style={styles.bookCard}>
        <Card.Content>
          <View style={styles.bookHeader}>
            <View style={styles.bookTitleContainer}>
              <Text style={styles.bookName} numberOfLines={2}>
                {item.bookName}
              </Text>
              <Text style={styles.bookNumber}>{item.bookNumber}</Text>
            </View>
            <View style={[styles.overdueBadge, { backgroundColor: '#FFEBEE' }]}>
              <Icon name="alert-circle" size={18} color="#F44336" />
              <Text style={[styles.badgeText, { color: '#F44336' }]}>
                {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="book" size={18} color="#2196F3" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Author</Text>
                <Text style={styles.detailValue}>{item.author}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="tag" size={18} color="#9C27B0" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Subject</Text>
                <Text style={styles.detailValue}>{item.subject}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="account" size={18} color="#FF9800" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Borrowed By</Text>
                <Text style={styles.detailValue}>{item.borrowedBy || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="calendar-check" size={18} color="#4CAF50" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>{formatDate(item.dueDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Icon name="calendar-alert" size={18} color="#F44336" />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Overdue By</Text>
                <Text style={[styles.detailValue, { color: '#F44336', fontWeight: '700' }]}>
                  {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Overdue Books</Title>
              <Text style={styles.headerSubtitle}>Books crossed their due date</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="alert-circle" size={40} color="#F44336" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="alert-octagon" size={24} color="#F44336" />
              <Text style={[styles.statValue, { color: '#F44336' }]}>
                {overdueBooks.length}
              </Text>
              <Text style={styles.statLabel}>Overdue Books</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Books List */}
      <ScrollView style={styles.booksContainer}>
        {overdueBooks.length > 0 ? (
          <FlatList
            data={overdueBooks}
            renderItem={renderBookItem}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyText}>No overdue books</Text>
            <Text style={styles.emptySubtext}>All books are within due date</Text>
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
    backgroundColor: '#FFF3E0',
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
    color: '#F44336',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  booksContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  bookCard: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bookTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  bookName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  bookNumber: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  overdueBadge: {
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
  divider: {
    marginVertical: 12,
  },
  detailRow: {
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
  separator: {
    height: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
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

export default BookOverdueRequestsScreen;
