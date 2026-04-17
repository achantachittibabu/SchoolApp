import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  TextInput,
  Divider,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mockHolidays } from '../utils/mockHolidayData';

const HolidayCalendarScreen = ({ navigation }) => {
  const [allHolidays, setAllHolidays] = useState(mockHolidays);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    comments: '',
  });
  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    } else {
      // Validate date format YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
        newErrors.date = 'Date format should be YYYY-MM-DD';
      }
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Holiday name is required';
    }

    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddHoliday = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    const newHoliday = {
      id: String(allHolidays.length + 1),
      date: formData.date,
      name: formData.name,
      comments: formData.comments,
    };

    setAllHolidays([...allHolidays, newHoliday]);
    setShowAddModal(false);
    setFormData({ date: '', name: '', comments: '' });
    setErrors({});

    Alert.alert('Success', `Holiday "${formData.name}" added successfully!`);
  };

  const handleUpdateClick = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      date: holiday.date,
      name: holiday.name,
      comments: holiday.comments,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateHoliday = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
      return;
    }

    const updatedHolidays = allHolidays.map((h) =>
      h.id === selectedHoliday.id
        ? {
            ...h,
            date: formData.date,
            name: formData.name,
            comments: formData.comments,
          }
        : h
    );

    setAllHolidays(updatedHolidays);
    setShowUpdateModal(false);
    setSelectedHoliday(null);
    setFormData({ date: '', name: '', comments: '' });
    setErrors({});

    Alert.alert('Success', `Holiday "${formData.name}" updated successfully!`);
  };

  const handleDeleteHoliday = (holiday) => {
    Alert.alert(
      'Delete Holiday',
      `Are you sure you want to delete "${holiday.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setAllHolidays(allHolidays.filter((h) => h.id !== holiday.id));
            Alert.alert('Success', 'Holiday deleted successfully!');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const sortedHolidays = allHolidays.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const getHolidayMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const renderHolidayRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.cellText}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.cellSubText} numberOfLines={1}>
          {item.comments}
        </Text>
      </View>
      <View style={styles.actionCellSmall}>
        <TouchableOpacity
          onPress={() => handleUpdateClick(item)}
          style={styles.updateButton}
        >
          <Icon name="pencil" size={12} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteHoliday(item)}
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
              <Title style={styles.headerTitle}>Holiday Calendar</Title>
              <Text style={styles.headerSubtitle}>
                Manage school holidays {new Date().getFullYear()}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-multiple" size={40} color="#E91E63" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Icon name="calendar-check" size={28} color="#E91E63" />
              <View style={styles.statTextGroup}>
                <Text style={styles.statLabel}>Total Holidays</Text>
                <Text style={styles.statValue}>{allHolidays.length}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Add Holiday Button */}
      <TouchableOpacity
        onPress={() => {
          setSelectedHoliday(null);
          setFormData({ date: '', name: '', comments: '' });
          setErrors({});
          setShowAddModal(true);
        }}
        style={styles.addButton}
      >
        <Icon name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Holiday</Text>
      </TouchableOpacity>

      {/* Holiday Table */}
      <Card style={styles.tableCard}>
        <Card.Content>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Holiday Name</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Comments</Text>
            </View>
            <View style={styles.actionCellSmall}>
              <Text style={styles.headerText}>Action</Text>
            </View>
          </View>

          <Divider style={styles.tableDivider} />

          {/* Holidays List */}
          {sortedHolidays.length > 0 ? (
            <FlatList
              data={sortedHolidays}
              renderItem={renderHolidayRow}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Divider style={styles.rowDivider} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="calendar-remove" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No holidays added</Text>
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

      {/* Add/Update Holiday Modal */}
      <Modal
        visible={showAddModal || showUpdateModal}
        onDismiss={() => {
          setShowAddModal(false);
          setShowUpdateModal(false);
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Content>
            <Text style={styles.modalTitle}>
              {selectedHoliday ? 'Update Holiday' : 'Add New Holiday'}
            </Text>
            <Divider style={styles.divider} />

            {/* Date Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Date (YYYY-MM-DD) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                placeholder="e.g., 2026-12-25"
                value={formData.date}
                onChangeText={(value) => {
                  setFormData({ ...formData, date: value });
                  if (errors.date) setErrors({ ...errors, date: undefined });
                }}
                mode="outlined"
                outlineColor={errors.date ? '#F44336' : '#e0e0e0'}
                activeOutlineColor={errors.date ? '#F44336' : '#E91E63'}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            {/* Holiday Name Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Holiday Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g., Diwali, Christmas"
                value={formData.name}
                onChangeText={(value) => {
                  setFormData({ ...formData, name: value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                mode="outlined"
                outlineColor={errors.name ? '#F44336' : '#e0e0e0'}
                activeOutlineColor={errors.name ? '#F44336' : '#E91E63'}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Comments Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Comments <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.messageInput, errors.comments && styles.inputError]}
                placeholder="Add holiday details or description..."
                value={formData.comments}
                onChangeText={(value) => {
                  setFormData({ ...formData, comments: value });
                  if (errors.comments) setErrors({ ...errors, comments: undefined });
                }}
                mode="outlined"
                multiline
                numberOfLines={3}
                outlineColor={errors.comments ? '#F44336' : '#e0e0e0'}
                activeOutlineColor={errors.comments ? '#F44336' : '#E91E63'}
              />
              {errors.comments && (
                <Text style={styles.errorText}>{errors.comments}</Text>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Modal Buttons */}
            <View style={styles.modalButtonGroup}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowAddModal(false);
                  setShowUpdateModal(false);
                  setSelectedHoliday(null);
                  setFormData({ date: '', name: '', comments: '' });
                }}
                style={styles.modalCancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={selectedHoliday ? handleUpdateHoliday : handleAddHoliday}
                style={styles.modalSaveButton}
                buttonColor="#E91E63"
              >
                {selectedHoliday ? 'Update' : 'Add'}
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
    color: '#E91E63',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#FCE4EC',
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
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statTextGroup: {
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E91E63',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#FCE4EC',
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
    color: '#E91E63',
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
    backgroundColor: '#2196F3',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
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
  divider: {
    marginVertical: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  messageInput: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    minHeight: 80,
  },
  inputError: {
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    fontWeight: '500',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalSaveButton: {
    flex: 1,
  },
  bottomPadding: {
    height: 12,
  },
});

export default HolidayCalendarScreen;
