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
import { mockLeaveRequests } from '../utils/mockLeaveData';

const PendingLeaveApprovalsScreen = ({ navigation }) => {
  const [allRequests, setAllRequests] = useState(mockLeaveRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockLeaveRequests);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectComment, setRejectComment] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filter requests based on selected filter
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(
        allRequests.filter((request) => request.requesterType === selectedFilter)
      );
    }
  }, [selectedFilter, allRequests]);

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Leave Request',
      `Approve leave request from ${request.requesterName}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            const updatedRequests = allRequests.filter((r) => r.id !== request.id);
            setAllRequests(updatedRequests);
            Alert.alert('Success', `Leave request approved for ${request.requesterName}`);
          },
          style: 'default',
        },
      ]
    );
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectComment('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    const updatedRequests = allRequests.filter((r) => r.id !== selectedRequest.id);
    setAllRequests(updatedRequests);
    setShowRejectModal(false);
    Alert.alert(
      'Request Rejected',
      `Leave request from ${selectedRequest.requesterName} has been rejected.${
        rejectComment ? `\n\nComment: ${rejectComment}` : ''
      }`
    );
  };

  const renderRequestRow = ({ item }) => (
    <View style={styles.tableRow}>
      <TouchableOpacity
        onPress={() => navigation.navigate('LeaveHistory')}
        style={styles.requestButtonCell}
      >
        <Text style={styles.cellText} numberOfLines={1}>
          {item.requesterName}
        </Text>
        <Text style={styles.cellSubText}>{item.requesterType}</Text>
      </TouchableOpacity>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.leaveType}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{formatDate(item.fromDate)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{formatDate(item.toDate)}</Text>
      </View>
      <View style={styles.actionCell}>
        <TouchableOpacity
          onPress={() => handleApprove(item)}
          style={styles.approveButton}
        >
          <Icon name="check" size={14} color="#fff" />
          <Text style={styles.actionButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRejectClick(item)}
          style={styles.rejectButton}
        >
          <Icon name="close" size={14} color="#fff" />
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFilterStats = () => {
    const total = allRequests.length;
    const students = allRequests.filter((r) => r.requesterType === 'student').length;
    const teachers = allRequests.filter((r) => r.requesterType === 'teacher').length;
    const admins = allRequests.filter((r) => r.requesterType === 'admin').length;
    
    return { total, students, teachers, admins };
  };

  const stats = getFilterStats();

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Leave Approvals</Title>
              <Text style={styles.headerSubtitle}>Manage pending leave requests</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="clipboard-check" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filter Card */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Text style={styles.filterTitle}>Filter by Type</Text>
          <View style={styles.filterButtonGroup}>
            {[
              { label: 'All', value: 'all', color: '#2196F3' },
              { label: 'Student', value: 'student', color: '#4CAF50' },
              { label: 'Teacher', value: 'teacher', color: '#FF9800' },
              { label: 'Admin', value: 'admin', color: '#9C27B0' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.value && {
                    backgroundColor: filter.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === filter.value && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="inbox-multiple" size={20} color="#2196F3" />
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="school" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>{stats.students}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="briefcase" size={20} color="#FF9800" />
              <Text style={styles.statValue}>{stats.teachers}</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="shield-account" size={20} color="#9C27B0" />
              <Text style={styles.statValue}>{stats.admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Requests Table */}
      <Card style={styles.tableCard}>
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Request</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Type</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>From</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>To</Text>
            </View>
            <View style={styles.actionCell}>
              <Text style={styles.headerText}>Action</Text>
            </View>
          </View>

          <Divider style={styles.tableDivider} />

          {/* Requests List */}
          {filteredRequests.length > 0 ? (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestRow}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Divider style={styles.rowDivider} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No pending leave requests</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Back to Attendance</Text>
      </TouchableOpacity>

      {/* Reject Modal */}
      <Modal
        visible={showRejectModal}
        onDismiss={() => setShowRejectModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text style={styles.modalTitle}>Reject Leave Request</Text>
            <Divider style={styles.divider} />

            {selectedRequest && (
              <>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Requester:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.requesterName}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Leave Type:</Text>
                  <Text style={styles.modalValue}>{selectedRequest.leaveType}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Period:</Text>
                  <Text style={styles.modalValue}>
                    {formatDate(selectedRequest.fromDate)} - {formatDate(selectedRequest.toDate)}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.commentLabel}>Rejection Comment (Optional)</Text>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Provide reason for rejection..."
                  value={rejectComment}
                  onChangeText={setRejectComment}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            <Divider style={styles.divider} />

            <View style={styles.modalButtonGroup}>
              <Button
                mode="outlined"
                onPress={() => setShowRejectModal(false)}
                style={styles.modalCancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleRejectSubmit}
                style={styles.modalRejectButton}
                buttonColor="#F44336"
              >
                Reject
              </Button>
            </View>
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
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
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
    marginHorizontal: 12,
    marginBottom: 12,
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
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  requestButtonCell: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  actionCell: {
    width: 140,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#2196F3',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cellText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  cellSubText: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  tableDivider: {
    marginBottom: 8,
  },
  rowDivider: {
    marginVertical: 8,
  },
  actionCell: {
    width: 140,
    flexDirection: 'row',
    gap: 4,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 2,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 2,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
  modalContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  modalCard: {
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  modalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    fontSize: 13,
    marginBottom: 12,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalRejectButton: {
    flex: 1,
  },
  bottomPadding: {
    height: 12,
  },
});

export default PendingLeaveApprovalsScreen;
