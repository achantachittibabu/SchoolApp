import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Platform,
  DatePickerAndroid,
  DatePickerIOS,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
  Modal,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { mockTimeTables } from '../utils/mockTimeTableData';

const TimeTableScreen = ({ navigation }) => {
  const [allTimeTables, setAllTimeTables] = useState(mockTimeTables);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTimeTable, setSelectedTimeTable] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showIOSDatePicker, setShowIOSDatePicker] = useState(false);

  useEffect(() => {
    // Refresh data when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      // Fetch or refresh timetables
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteClick = (timeTable) => {
    setSelectedTimeTable(timeTable);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTimeTable) {
      setAllTimeTables(allTimeTables.filter((t) => t.id !== selectedTimeTable.id));
      setShowDeleteModal(false);
      Alert.alert('Success', 'Timetable deleted successfully!');
    }
  };

  const handleDatePick = async () => {
    if (Platform.OS === 'android') {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: selectedDate,
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          const newDate = new Date(year, month, day);
          setSelectedDate(newDate);
        }
      } catch ({ code, message }) {
        console.warn('Cannot open date picker', message);
      }
    } else {
      setShowIOSDatePicker(true);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeTableTitle = (timeTable) => {
    if (timeTable.type === 'student') {
      return `${timeTable.class} - Student`;
    } else {
      return 'Teacher Timetable';
    }
  };

  const renderTimeTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {getTimeTableTitle(item)}
        </Text>
        <Text style={styles.cellSubText}>{item.type}</Text>
      </View>
      <View style={styles.tableCell}>
        <View style={styles.periodsContainer}>
          {item.morning.periods && item.morning.periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={styles.periodButton}
            >
              <Text style={styles.periodButtonText}>{period.name}</Text>
              <Text style={styles.periodTimeText}>{period.from} - {period.to}</Text>
              <Text style={styles.periodSubjectText}>{period.subject}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.tableCell}>
        <View style={styles.periodsContainer}>
          {item.afternoon.periods && item.afternoon.periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={styles.periodButton}
            >
              <Text style={styles.periodButtonText}>{period.name}</Text>
              <Text style={styles.periodTimeText}>{period.from} - {period.to}</Text>
              <Text style={styles.periodSubjectText}>{period.subject}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.actionCellSmall}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditTimeTable', { timeTable: item })}
          style={styles.updateButton}
        >
          <Icon name="pencil" size={12} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteClick(item)}
          style={styles.deleteButton}
        >
          <Icon name="trash-can" size={12} color="#fff" />
          <Text style={styles.actionButtonText}>Del</Text>
        </TouchableOpacity>
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
              <Title style={styles.headerTitle}>Time Table Management</Title>
              <Text style={styles.headerSubtitle}>Manage school timetables</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-grid" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTimeTable')}
          style={styles.createButton}
        >
          <Icon name="plus-circle" size={18} color="#fff" />
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Type:</Text>
          <View style={styles.filterPickerContainer}>
            <Picker
              selectedValue={filterType}
              onValueChange={(itemValue) => setFilterType(itemValue)}
              style={styles.filterPicker}
              mode="dropdown"
            >
              <Picker.Item label="All" value="all" />
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Pick Date:</Text>
          <TouchableOpacity
            onPress={handleDatePick}
            style={styles.datePickerButton}
          >
            <Icon name="calendar" size={16} color="#2196F3" />
            <Text style={styles.datePickerButtonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>
        </View>

        {Platform.OS === 'ios' && showIOSDatePicker && (
          <View style={styles.iosDatePickerContainer}>
            <DatePickerIOS
              date={selectedDate}
              onDateChange={setSelectedDate}
              mode="date"
            />
            <TouchableOpacity
              onPress={() => setShowIOSDatePicker(false)}
              style={styles.iosDatePickerDone}
            >
              <Text style={styles.iosDatePickerDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* TimeTable List */}
      <Card style={styles.tableCard}>
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>TimeTable</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Morning</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Afternoon</Text>
            </View>
            <View style={styles.actionCellSmall}>
              <Text style={styles.headerText}>Action</Text>
            </View>
          </View>

          <Divider style={styles.tableDivider} />

          {/* TimeTables List */}
          {allTimeTables.length > 0 ? (
            <FlatList
              data={filterType === 'all' ? allTimeTables : allTimeTables.filter(t => t.type === filterType)}
              renderItem={renderTimeTableRow}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Divider style={styles.rowDivider} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="calendar-remove" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No timetables found</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text style={styles.modalTitle}>Delete TimeTable</Text>
            <Divider style={styles.divider} />

            {selectedTimeTable && (
              <>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this timetable?
                </Text>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>TimeTable:</Text>
                  <Text style={styles.modalValue}>{getTimeTableTitle(selectedTimeTable)}</Text>
                </View>
              </>
            )}

            <Divider style={styles.divider} />

            <View style={styles.modalButtonGroup}>
              <Button
                mode="outlined"
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalCancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleDeleteConfirm}
                style={styles.modalDeleteButton}
                buttonColor="#F44336"
              >
                Delete
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  updateButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  filterSection: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'column',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    minWidth: 100,
  },
  filterPickerContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2196F3',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  filterPicker: {
    height: 40,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2196F3',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    gap: 8,
  },
  datePickerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2196F3',
  },
  iosDatePickerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 10,
  },
  iosDatePickerDone: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosDatePickerDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
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
  actionCellSmall: {
    width: 100,
    flexDirection: 'row',
    gap: 2,
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
  periodsContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  periodButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  periodTimeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  periodSubjectText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  tableDivider: {
    marginBottom: 8,
  },
  rowDivider: {
    marginVertical: 8,
  },
  updateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 2,
  },
  deleteButton: {
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
  divider: {
    marginVertical: 12,
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
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalDeleteButton: {
    flex: 1,
  },
  bottomPadding: {
    height: 12,
  },
});

export default TimeTableScreen;
