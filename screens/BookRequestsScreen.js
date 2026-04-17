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
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { mockBookRequests } from '../utils/mockLibraryData';

const BookRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState(mockBookRequests.filter(r => r.status === 'pending'));
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  const [rejectErrors, setRejectErrors] = useState({});
  const [requestType, setRequestType] = useState('issued');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Request',
      `Approve book request from ${request.studentName} for "${request.bookName}"?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setRequests(requests.filter(r => r.id !== request.id));
            Alert.alert('Success', `Request approved for ${request.studentName}`);
          },
          style: 'default',
        },
      ]
    );
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectComment('');
    setRejectErrors({});
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    const errors = {};

    if (!rejectComment.trim()) {
      errors.comment = 'Rejection comment is required';
    }

    setRejectErrors(errors);

    if (Object.keys(errors).length === 0) {
      setRequests(requests.filter(r => r.id !== selectedRequest.id));
      setShowRejectModal(false);
      Alert.alert(
        'Request Rejected',
        `Book request from ${selectedRequest.studentName} has been rejected.\n\nComment: ${rejectComment}`
      );
    }
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
          <View style={styles.requestBadge}>
            <Icon name="clock-outline" size={16} color="#FF9800" />
            <Text style={styles.badgeText}>Pending</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.requestDetailRow}>
          <View style={styles.detailItem}>
            <Icon name="account" size={20} color="#2196F3" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Student</Text>
              <Text style={styles.detailValue}>{item.studentName}</Text>
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
            <Icon name="calendar" size={20} color="#9C27B0" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Request Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.requestDate)}</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            onPress={() => handleApprove(item)}
            style={[styles.actionButton, styles.approveButton]}
          >
            <Icon name="check-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleRejectClick(item)}
            style={[styles.actionButton, styles.rejectButton]}
          >
            <Icon name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
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
              <Title style={styles.headerTitle}>Book Requests</Title>
              <Text style={styles.headerSubtitle}>Manage pending book requests</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="clipboard-list" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Request Type Filter Card */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Request Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={requestType}
                onValueChange={(value) => setRequestType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Issued" value="issued" />
                <Picker.Item label="Returns" value="returns" />
              </Picker>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="inbox-multiple" size={24} color="#FF9800" />
              <Text style={styles.statValue}>{requests.length}</Text>
              <Text style={styles.statLabel}>Pending Requests</Text>
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
            <Text style={styles.emptyText}>No pending requests</Text>
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

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        onDismiss={() => setShowRejectModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text style={styles.modalTitle}>Reject Request</Text>
            <Divider style={styles.divider} />

            {selectedRequest && (
              <>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Book:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.bookName}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Student:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.studentName}</Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.commentLabel}>
                  Rejection Reason <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.commentInput, rejectErrors.comment && styles.inputError]}
                  placeholder="Enter reason for rejection..."
                  value={rejectComment}
                  onChangeText={(text) => {
                    setRejectComment(text);
                    if (rejectErrors.comment) {
                      setRejectErrors({ ...rejectErrors, comment: undefined });
                    }
                  }}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  outlineColor={rejectErrors.comment ? '#F44336' : '#e0e0e0'}
                  activeOutlineColor={rejectErrors.comment ? '#F44336' : '#FF9800'}
                />
                {rejectErrors.comment && (
                  <Text style={styles.errorText}>{rejectErrors.comment}</Text>
                )}

                <Divider style={styles.divider} />

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    onPress={() => setShowRejectModal(false)}
                    style={[styles.modalButton, styles.modalCancelButton]}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleRejectSubmit}
                    style={[styles.modalButton, styles.modalRejectButton]}
                  >
                    <Text style={styles.modalButtonText}>Reject</Text>
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
  filterCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  picker: {
    height: 50,
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
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF9800',
  },
  statLabel: {
    fontSize: 12,
    color: '#F57C00',
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
  requestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
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
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    fontSize: 12,
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
  modalRejectButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BookRequestsScreen;
