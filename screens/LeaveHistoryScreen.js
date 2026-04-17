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
import { Picker } from '@react-native-picker/picker';
import { mockLeaveHistory } from '../utils/mockLeaveHistory';

const LeaveHistoryScreen = ({ navigation }) => {
  const [allLeaves, setAllLeaves] = useState(mockLeaveHistory);
  const [filteredLeaves, setFilteredLeaves] = useState(mockLeaveHistory);
  const [selectedFilter, setSelectedFilter] = useState('currentMonth');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getMonthYearString = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const filterLeavesByDate = (leaves, filterType) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return leaves.filter((leave) => {
      const fromDate = new Date(leave.fromDate);

      switch (filterType) {
        case 'currentMonth':
          return (
            fromDate.getFullYear() === currentYear &&
            fromDate.getMonth() === currentMonth
          );

        case 'lastThreeMonths':
          const threeMonthsAgo = new Date(today);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return fromDate >= threeMonthsAgo && fromDate <= today;

        case 'sixMonths':
          const sixMonthsAgo = new Date(today);
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return fromDate >= sixMonthsAgo && fromDate <= today;

        case 'thisYear':
          return fromDate.getFullYear() === currentYear;

        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const filtered = filterLeavesByDate(allLeaves, selectedFilter);
    // Sort by from date in descending order
    const sorted = filtered.sort(
      (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
    );
    setFilteredLeaves(sorted);
  }, [selectedFilter, allLeaves]);

  const calculateTotalDays = () => {
    return filteredLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);
  };

  const getStatusColor = (status) => {
    return status === 'approved' ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = (status) => {
    return status === 'approved' ? 'check-circle' : 'close-circle';
  };

  const renderLeaveRow = ({ item }) => (
    <View style={styles.tableRow}>
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
      <View style={styles.tableCell}>
        <View style={styles.totalDaysCell}>
          <Text style={styles.totalDaysText}>{item.totalDays}</Text>
          <Icon
            name={getStatusIcon(item.status)}
            size={14}
            color={getStatusColor(item.status)}
            style={styles.statusIcon}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Leave History</Title>
              <Text style={styles.headerSubtitle}>View all approved leaves</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="history" size={40} color="#9C27B0" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Filter Card */}
      <Card style={styles.filterCard}>
        <Card.Content>
          <Text style={styles.filterLabel}>Filter by Period</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFilter}
              onValueChange={(itemValue) => setSelectedFilter(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item
                label="Current Month"
                value="currentMonth"
              />
              <Picker.Item
                label="Last 3 Months"
                value="lastThreeMonths"
              />
              <Picker.Item
                label="Last 6 Months"
                value="sixMonths"
              />
              <Picker.Item
                label="This Year"
                value="thisYear"
              />
            </Picker>
            <Icon name="filter-variant" size={20} color="#9C27B0" />
          </View>
        </Card.Content>
      </Card>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Icon name="calendar-multiple-check" size={28} color="#9C27B0" />
              <View style={styles.summaryTextGroup}>
                <Text style={styles.summaryLabel}>Total Leaves</Text>
                <Text style={styles.summaryValue}>{filteredLeaves.length}</Text>
              </View>
            </View>
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Icon name="clock-outline" size={28} color="#FF9800" />
              <View style={styles.summaryTextGroup}>
                <Text style={styles.summaryLabel}>Total Days</Text>
                <Text style={styles.summaryValue}>{calculateTotalDays()}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Leave History Table */}
      <Card style={styles.tableCard}>
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Leave Type</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>From</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>To</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Days</Text>
            </View>
          </View>

          <Divider style={styles.tableDivider} />

          {/* Leaves List */}
          {filteredLeaves.length > 0 ? (
            <FlatList
              data={filteredLeaves}
              renderItem={renderLeaveRow}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Divider style={styles.rowDivider} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="folder-open" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No leave records found</Text>
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
        <Text style={styles.backButtonText}>Back</Text>
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
    color: '#9C27B0',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#F3E5F5',
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
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#9C27B0',
    borderRadius: 8,
    paddingRight: 12,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    flex: 1,
    color: '#333',
    height: 50,
  },
  summaryCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryTextGroup: {
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9C27B0',
  },
  summaryDivider: {
    width: 1,
    height: 60,
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
    backgroundColor: '#F3E5F5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#9C27B0',
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
  tableDivider: {
    marginBottom: 8,
  },
  rowDivider: {
    marginVertical: 8,
  },
  totalDaysCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalDaysText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  statusIcon: {
    marginLeft: 4,
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
    backgroundColor: '#9C27B0',
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

export default LeaveHistoryScreen;
