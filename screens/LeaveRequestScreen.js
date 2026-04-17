import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  TextInput,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const LeaveRequestScreen = ({ navigation, route }) => {
  const [userType, setUserType] = useState(route.params?.userType || 'student');
  const [leaveType, setLeaveType] = useState('personal work');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const leaveTypes = ['Personal Work', 'Medical Issue', 'Vacation', 'Planned Leave', 'Other'];

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (toDate < fromDate) {
      newErrors.toDate = 'To date must be after from date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyLeave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    const userTypeLabel = userType === 'student' ? 'Student' : (userType === 'teacher' ? 'Teacher' : 'Admin');

    Alert.alert(
      'Leave Request Submitted',
      `${userTypeLabel} leave request submitted successfully!\n\nType: ${leaveType}\nFrom: ${formatDate(fromDate)}\nTo: ${formatDate(toDate)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (subject.trim() || message.trim()) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard this leave request?',
        [
          { text: 'Keep Editing', onPress: () => {} },
          {
            text: 'Discard',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Leave Request</Title>
              <Text style={styles.headerSubtitle}>
                Submit a leave request
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-clock" size={40} color="#FF9800" />
            </View>
          </View>

          <Divider style={styles.headerDivider} />

          {/* Header Buttons */}
          <View style={styles.headerButtonGroup}>
            <TouchableOpacity
              style={styles.activeHeaderButton}
              disabled
            >
              <Icon name="pencil" size={16} color="#fff" />
              <Text style={styles.activeHeaderButtonText}>Leave Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('LeaveHistory')}
              style={styles.headerButton}
            >
              <Icon name="history" size={16} color="#FF9800" />
              <Text style={styles.headerButtonText}>Leave History</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* User Type Info */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              {userType === 'student'
                ? 'Student Leave Request'
                : userType === 'teacher'
                ? 'Teacher Leave Request'
                : 'Admin Leave Request'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Form Card */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Leave Details</Text>
          <Divider style={styles.divider} />

          {/* Leave Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Leave Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={leaveType}
                onValueChange={(value) => setLeaveType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Personal Work" value="personal work" />
                <Picker.Item label="Medical Issue" value="medical issue" />
                <Picker.Item label="Vacation" value="vacation" />
                <Picker.Item label="Planned Leave" value="planned leave" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          {/* From Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              From Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.dateButton}>
              <Icon name="calendar" size={20} color="#2196F3" />
              <Text style={styles.dateButtonText}>{formatDate(fromDate)}</Text>
              <Text style={styles.dateNote}>(Today by default)</Text>
            </TouchableOpacity>
          </View>

          {/* To Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              To Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity style={styles.dateButton}>
              <Icon name="calendar" size={20} color="#2196F3" />
              <Text style={styles.dateButtonText}>{formatDate(toDate)}</Text>
              <Text style={styles.dateNote}>(Same as from date by default)</Text>
            </TouchableOpacity>
            {errors.toDate && <Text style={styles.errorText}>{errors.toDate}</Text>}
          </View>

          {/* Subject */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Subject <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.subject && styles.inputError]}
              placeholder="e.g., Medical Appointment, Family Event"
              value={subject}
              onChangeText={(value) => {
                setSubject(value);
                if (errors.subject) setErrors({ ...errors, subject: undefined });
              }}
              mode="outlined"
              outlineColor={errors.subject ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.subject ? '#F44336' : '#2196F3'}
            />
            {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
          </View>

          {/* Message */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Message <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.messageInput, errors.message && styles.inputError]}
              placeholder="Provide details about your leave request..."
              value={message}
              onChangeText={(value) => {
                setMessage(value);
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              mode="outlined"
              multiline
              numberOfLines={4}
              outlineColor={errors.message ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.message ? '#F44336' : '#2196F3'}
            />
            {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
          </View>

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleApplyLeave}
              style={styles.applyButton}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.applyButtonText}>Apply Leave</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Icon name="close-circle" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  headerDivider: {
    marginVertical: 12,
  },
  headerButtonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  activeHeaderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeHeaderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  headerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FF9800',
    gap: 6,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  infoCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  formCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  picker: {
    height: 50,
  },
  input: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  messageInput: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    minHeight: 100,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    gap: 10,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    flex: 1,
  },
  dateNote: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 20,
  },
});

export default LeaveRequestScreen;
