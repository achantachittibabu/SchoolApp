import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
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
import { Picker } from '@react-native-picker/picker';

const EditTimeTableScreen = ({ navigation, route }) => {
  const { timeTable } = route.params;

  const [timetableType, setTimetableType] = useState(timeTable.type);
  const [selectedClass, setSelectedClass] = useState(timeTable.class || '');
  const [morningFrom, setMorningFrom] = useState(timeTable.morning.from);
  const [morningTo, setMorningTo] = useState(timeTable.morning.to);
  const [morningPeriods, setMorningPeriods] = useState(timeTable.morning.periods || []);
  const [lunchFrom, setLunchFrom] = useState(timeTable.lunch.from);
  const [lunchTo, setLunchTo] = useState(timeTable.lunch.to);
  const [afternoonFrom, setAfternoonFrom] = useState(timeTable.afternoon.from);
  const [afternoonTo, setAfternoonTo] = useState(timeTable.afternoon.to);
  const [afternoonPeriods, setAfternoonPeriods] = useState(timeTable.afternoon.periods || []);
  const [errors, setErrors] = useState({});

  const classes = ['Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 11-B'];

  const addMorningPeriod = () => {
    const newPeriod = {
      id: Date.now().toString(),
      name: `Period ${morningPeriods.length + 1}`,
      from: '',
      to: '',
      subject: '',
    };
    setMorningPeriods([...morningPeriods, newPeriod]);
  };

  const addAfternoonPeriod = () => {
    const newPeriod = {
      id: Date.now().toString(),
      name: `Period ${morningPeriods.length + afternoonPeriods.length + 1}`,
      from: '',
      to: '',
      subject: '',
    };
    setAfternoonPeriods([...afternoonPeriods, newPeriod]);
  };

  const removeMorningPeriod = (id) => {
    setMorningPeriods(morningPeriods.filter((p) => p.id !== id));
  };

  const removeAfternoonPeriod = (id) => {
    setAfternoonPeriods(afternoonPeriods.filter((p) => p.id !== id));
  };

  const updateMorningPeriod = (id, field, value) => {
    const updated = morningPeriods.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setMorningPeriods(updated);
  };

  const updateAfternoonPeriod = (id, field, value) => {
    const updated = afternoonPeriods.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setAfternoonPeriods(updated);
  };

  const validateForm = () => {
    const newErrors = {};

    if (timetableType === 'student' && !selectedClass) {
      newErrors.class = 'Class is required for student timetable';
    }

    if (!morningFrom) newErrors.morningFrom = 'Morning start time is required';
    if (!morningTo) newErrors.morningTo = 'Morning end time is required';
    if (!lunchFrom) newErrors.lunchFrom = 'Lunch start time is required';
    if (!lunchTo) newErrors.lunchTo = 'Lunch end time is required';
    if (!afternoonFrom) newErrors.afternoonFrom = 'Afternoon start time is required';
    if (!afternoonTo) newErrors.afternoonTo = 'Afternoon end time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateTimeTable = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const updatedTimeTable = {
      ...timeTable,
      type: timetableType,
      class: timetableType === 'student' ? selectedClass : null,
      morning: { from: morningFrom, to: morningTo, periods: morningPeriods },
      lunch: { from: lunchFrom, to: lunchTo },
      afternoon: { from: afternoonFrom, to: afternoonTo, periods: afternoonPeriods },
    };

    Alert.alert(
      'Success',
      `Timetable updated successfully!${timetableType === 'student' ? ` for ${selectedClass}` : ''}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderMorningPeriod = ({ item }) => (
    <View style={styles.periodCard}>
      <View style={styles.periodHeader}>
        <Text style={styles.periodName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => removeMorningPeriod(item.id)}
          style={styles.removeButton}
        >
          <Icon name="trash-can" size={16} color="#F44336" />
        </TouchableOpacity>
      </View>
      <View style={styles.periodFieldsRow}>
        <View style={styles.periodField}>
          <Text style={styles.fieldLabel}>From</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="HH:MM"
            value={item.from}
            onChangeText={(value) => updateMorningPeriod(item.id, 'from', value)}
            mode="outlined"
          />
        </View>
        <View style={styles.periodField}>
          <Text style={styles.fieldLabel}>To</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="HH:MM"
            value={item.to}
            onChangeText={(value) => updateMorningPeriod(item.id, 'to', value)}
            mode="outlined"
          />
        </View>
        <View style={styles.periodFieldWide}>
          <Text style={styles.fieldLabel}>Subject</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="Subject"
            value={item.subject}
            onChangeText={(value) => updateMorningPeriod(item.id, 'subject', value)}
            mode="outlined"
          />
        </View>
      </View>
    </View>
  );

  const renderAfternoonPeriod = ({ item }) => (
    <View style={styles.periodCard}>
      <View style={styles.periodHeader}>
        <Text style={styles.periodName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => removeAfternoonPeriod(item.id)}
          style={styles.removeButton}
        >
          <Icon name="trash-can" size={16} color="#F44336" />
        </TouchableOpacity>
      </View>
      <View style={styles.periodFieldsRow}>
        <View style={styles.periodField}>
          <Text style={styles.fieldLabel}>From</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="HH:MM"
            value={item.from}
            onChangeText={(value) => updateAfternoonPeriod(item.id, 'from', value)}
            mode="outlined"
          />
        </View>
        <View style={styles.periodField}>
          <Text style={styles.fieldLabel}>To</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="HH:MM"
            value={item.to}
            onChangeText={(value) => updateAfternoonPeriod(item.id, 'to', value)}
            mode="outlined"
          />
        </View>
        <View style={styles.periodFieldWide}>
          <Text style={styles.fieldLabel}>Subject</Text>
          <TextInput
            style={styles.periodInput}
            placeholder="Subject"
            value={item.subject}
            onChangeText={(value) => updateAfternoonPeriod(item.id, 'subject', value)}
            mode="outlined"
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View>
              <Title style={styles.headerTitle}>Edit Time Table</Title>
              <Text style={styles.headerSubtitle}>Update school timetable</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="calendar-edit" size={40} color="#FF9800" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Type Selection Card */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Timetable Type</Title>
          <Divider style={styles.divider} />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={timetableType}
              onValueChange={(itemValue) => {
                setTimetableType(itemValue);
                setSelectedClass('');
              }}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>

          {timetableType === 'student' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Class <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedClass}
                  onValueChange={(itemValue) => setSelectedClass(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item label="Select Class" value="" />
                  {classes.map((cls) => (
                    <Picker.Item key={cls} label={cls} value={cls} />
                  ))}
                </Picker>
              </View>
              {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Morning Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Morning Section</Title>
          <Divider style={styles.divider} />

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.label}>From <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={morningFrom}
                onChangeText={setMorningFrom}
                mode="outlined"
              />
              {errors.morningFrom && <Text style={styles.errorText}>{errors.morningFrom}</Text>}
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>To <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={morningTo}
                onChangeText={setMorningTo}
                mode="outlined"
              />
              {errors.morningTo && <Text style={styles.errorText}>{errors.morningTo}</Text>}
            </View>
          </View>

          <Text style={styles.subSectionTitle}>Periods</Text>

          {morningPeriods.length > 0 && (
            <FlatList
              data={morningPeriods}
              renderItem={renderMorningPeriod}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            onPress={addMorningPeriod}
            style={styles.addPeriodButton}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.addPeriodText}>Add Period</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Lunch Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Lunch Time</Title>
          <Divider style={styles.divider} />

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.label}>From <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={lunchFrom}
                onChangeText={setLunchFrom}
                mode="outlined"
              />
              {errors.lunchFrom && <Text style={styles.errorText}>{errors.lunchFrom}</Text>}
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>To <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={lunchTo}
                onChangeText={setLunchTo}
                mode="outlined"
              />
              {errors.lunchTo && <Text style={styles.errorText}>{errors.lunchTo}</Text>}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Afternoon Section */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Afternoon Section</Title>
          <Divider style={styles.divider} />

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={styles.label}>From <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={afternoonFrom}
                onChangeText={setAfternoonFrom}
                mode="outlined"
              />
              {errors.afternoonFrom && <Text style={styles.errorText}>{errors.afternoonFrom}</Text>}
            </View>
            <View style={styles.timeField}>
              <Text style={styles.label}>To <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={afternoonTo}
                onChangeText={setAfternoonTo}
                mode="outlined"
              />
              {errors.afternoonTo && <Text style={styles.errorText}>{errors.afternoonTo}</Text>}
            </View>
          </View>

          <Text style={styles.subSectionTitle}>Periods</Text>

          {afternoonPeriods.length > 0 && (
            <FlatList
              data={afternoonPeriods}
              renderItem={renderAfternoonPeriod}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            onPress={addAfternoonPeriod}
            style={styles.addPeriodButton}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.addPeriodText}>Add Period</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleUpdateTimeTable}
          style={styles.saveButton}
          buttonColor="#FF9800"
        >
          Update TimeTable
        </Button>
      </View>

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
  sectionCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9800',
    marginBottom: 4,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
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
    borderWidth: 1.5,
    borderColor: '#FF9800',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    fontWeight: '500',
  },
  periodCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  periodFieldsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  periodField: {
    flex: 0.4,
  },
  periodFieldWide: {
    flex: 0.6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  periodInput: {
    backgroundColor: '#fff',
    fontSize: 12,
  },
  addPeriodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  addPeriodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  bottomPadding: {
    height: 12,
  },
});

export default EditTimeTableScreen;
