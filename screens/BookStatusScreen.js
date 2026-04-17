import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BookStatusScreen = ({ navigation, route }) => {
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (route.params?.book) {
      setBook(route.params.book);
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

  const isOverdue = () => {
    if (!book?.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(book.dueDate);
    return dueDate < today;
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Book Status</Title>
              <Text style={styles.headerSubtitle}>View book availability details</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="information" size={40} color="#FF9800" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Status Alert Card */}
      <Card style={styles.statusCard}>
        <Card.Content>
          <View style={styles.statusContent}>
            <View style={styles.statusIconContainer}>
              <Icon name="close-circle" size={48} color="#F44336" />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Currently Unavailable</Text>
              <Text style={styles.statusSubtitle}>This book is checked out</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Book Details Card */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Book Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Book Number</Text>
            <Text style={styles.value}>{book.bookNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Book Name</Text>
            <Text style={[styles.value, styles.valueBold]}>{book.bookName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Author</Text>
            <Text style={styles.value}>{book.author}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Subject</Text>
            <Text style={styles.value}>{book.subject}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Publisher</Text>
            <Text style={styles.value}>{book.publisher}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>ISBN</Text>
            <Text style={styles.value}>{book.isbn}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Publication Year</Text>
            <Text style={styles.value}>{book.year}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Borrower Details Card */}
      <Card style={styles.borrowerCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Borrower Information</Text>
          <Divider style={styles.divider} />

          <View style={styles.borrowerInfoContainer}>
            <View style={styles.borrowerIconContainer}>
              <Icon name="account-circle" size={50} color="#2196F3" />
            </View>
            <View style={styles.borrowerTextContainer}>
              <Text style={styles.borrowerLabel}>Borrowed By</Text>
              <Text style={styles.borrowerName}>{book.borrowedBy || 'Unknown'}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.dueDateContainer}>
            <View style={styles.dueDateLeftContainer}>
              <Icon name="calendar-check" size={24} color="#4CAF50" />
              <View style={styles.dueDateTextContainer}>
                <Text style={styles.dueDateLabel}>Due Date</Text>
                <Text style={styles.dueDateValue}>{formatDate(book.dueDate)}</Text>
              </View>
            </View>
            {isOverdue() && (
              <View style={styles.overdueTag}>
                <Icon name="alert" size={16} color="#F44336" />
                <Text style={styles.overdueText}>Overdue</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Message Card */}
      <Card style={styles.messageCard}>
        <Card.Content>
          <View style={styles.messageContent}>
            <Icon name="lightbulb-on" size={24} color="#FF9800" />
            <Text style={styles.messageText}>
              This book will be available for borrowing once the due date is reached or the borrower returns it earlier.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Return Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.returnButton}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <Text style={styles.returnButtonText}>Back to Library</Text>
      </TouchableOpacity>

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
    color: '#FF9800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#FFF3E0',
    borderRadius: 50,
    padding: 12,
  },
  statusCard: {
    marginBottom: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#E53935',
  },
  detailCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  borrowerCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  messageCard: {
    marginBottom: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  valueBold: {
    fontWeight: '600',
  },
  borrowerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  borrowerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borrowerTextContainer: {
    flex: 1,
  },
  borrowerLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  borrowerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
    marginTop: 2,
  },
  dueDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dueDateLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dueDateTextContainer: {
    gap: 4,
  },
  dueDateLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  dueDateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    color: '#F57C00',
    fontWeight: '500',
    lineHeight: 18,
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    marginHorizontal: 12,
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 20,
  },
});

export default BookStatusScreen;
