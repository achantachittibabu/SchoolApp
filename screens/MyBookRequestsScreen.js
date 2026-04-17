import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  TextInput,
  Divider,
  Modal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockMyBookRequests } from '../utils/mockLibraryData';

const MyBookRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState(mockMyBookRequests);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [withdrawComment, setWithdrawComment] = useState('');
  const [withdrawErrors, setWithdrawErrors] = useState({});

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
      case 'withdrawn':
        return '#9E9E9E';
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
      case 'withdrawn':
        return 'minus-circle';
      default:
        return 'help-circle';
    }
  };

  const handleWithdrawClick = (request) => {
    if (request.status !== 'pending') {
      Alert.alert('Invalid Action', `Cannot withdraw a ${request.status} request`);
      return;
    }
    setSelectedRequest(request);
    setWithdrawComment('');
    setWithdrawErrors({});
    setShowWithdrawModal(true);
  };

  const handleWithdrawSubmit = () => {
    const errors = {};

    if (!withdrawComment.trim()) {
      errors.comment = 'Withdrawal reason is required';
    }

    setWithdrawErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Update the request status
      const updatedRequests = requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: 'withdrawn' } : r
      );
      setRequests(updatedRequests);
      setShowWithdrawModal(false);
      Alert.alert(
        'Request Withdrawn',
        `Your request for "${selectedRequest.bookName}" has been withdrawn.\n\nReason: ${withdrawComment}`
      );
    }
  };

  const handleReturnToLibrary = (request) => {
    if (request.status !== 'approved') {
      Alert.alert('Invalid Action', 'Only approved requests can be returned');
      return;
    }
    // Update the request status to returned (or remove it from the list)
    const updatedRequests = requests.map((r) =>
      r.id === request.id ? { ...r, status: 'returned' } : r
    );
    setRequests(updatedRequests);
    Alert.alert(
      'Book Returned',
      `Thank you for returning "${request.bookName}" to the library!`
    );
  };

  const renderRequestItem = ({ item }) => (
    <Card style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.requestTitleContainer}>
            <Text style={styles.bookName} numberOfLines={2}>
              {item.bookName}
            </Text>
            <Text style={styles.bookNumber}>({item.bookNumber})</Text>
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
            <Icon name="book" size={20} color="#2196F3" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Author</Text>
              <Text style={styles.detailValue}>{item.author}</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="tag" size={20} color="#9C27B0" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Subject</Text>
              <Text style={styles.detailValue}>{item.subject}</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={20} color="#9C27B0" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Request Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.requestDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar-check" size={20} color="#4CAF50" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Requested Return Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.requestedReturnDate)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="message-text" size={20} color="#FF9800" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Your Comments</Text>
              <Text style={styles.detailValue}>{item.submittedComments}</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {item.status === 'pending' && (
          <TouchableOpacity
            onPress={() => handleWithdrawClick(item)}
            style={styles.withdrawButton}
          >
            <Icon name="close-circle" size={20} color="#fff" />
            <Text style={styles.withdrawButtonText}>Withdraw Request</Text>
          </TouchableOpacity>
        )}

        {item.status === 'approved' && (
          <TouchableOpacity
            onPress={() => handleReturnToLibrary(item)}
            style={styles.returnButton}
          >
            <Icon name="undo" size={20} color="#fff" />
            <Text style={styles.returnButtonText}>Return to Library</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>My Book Requests</Title>
              <Text style={styles.headerSubtitle}>Track your book requests</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="clipboard-check" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="inbox-multiple" size={20} color="#FF9800" />
              <Text style={styles.statValue}>{requests.filter(r => r.status === 'pending').length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{requests.filter(r => r.status === 'approved').length}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="close-circle" size={20} color="#F44336" />
              <Text style={styles.statValue}>{requests.filter(r => r.status === 'rejected').length}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Requests List */}
      <ScrollView style={styles.requestsContainer}>
        {requests.length > 0 ? (
          <FlatList
            data={requests}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No requests submitted</Text>
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

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        onDismiss={() => setShowWithdrawModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text style={styles.modalTitle}>Withdraw Request</Text>
            <Divider style={styles.divider} />

            {selectedRequest && (
              <>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Book:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.bookName}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Book Number:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.bookNumber}</Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.commentLabel}>
                  Withdrawal Reason <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.commentInput, withdrawErrors.comment && styles.inputError]}
                  placeholder="Enter reason for withdrawal..."
                  value={withdrawComment}
                  onChangeText={(text) => {
                    setWithdrawComment(text);
                    if (withdrawErrors.comment) {
                      setWithdrawErrors({ ...withdrawErrors, comment: undefined });
                    }
                  }}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  outlineColor={withdrawErrors.comment ? '#F44336' : '#e0e0e0'}
                  activeOutlineColor={withdrawErrors.comment ? '#F44336' : '#FF9800'}
                />
                {withdrawErrors.comment && (
                  <Text style={styles.errorText}>{withdrawErrors.comment}</Text>
                )}

                <Divider style={styles.divider} />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    onPress={() => setShowWithdrawModal(false)}
                    style={[styles.modalButton, styles.modalCancelButton]}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleWithdrawSubmit}
                    style={[styles.modalButton, styles.modalWithdrawButton]}
                  >
                    <Text style={styles.modalButtonText}>Withdraw</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </Modal>

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
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
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
  requestTitleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  bookName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  bookNumber: {
    fontSize: 12,
    color: '#999',
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
  divider: {
    marginVertical: 12,
  },
  requestDetailRow: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  withdrawButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  returnButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
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
  // Modal Styles
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  modalCard: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 8,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  modalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    fontSize: 13,
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#e0e0e0',
  },
  modalWithdrawButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MyBookRequestsScreen;
