import React, { useState, useEffect } from 'react';
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

const UpdateBookScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    bookNumber: '',
    bookName: '',
    subject: 'Science',
    available: 'true',
    status: 'active',
    author: '',
    isbn: '',
    publisher: '',
    year: new Date().getFullYear().toString(),
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    if (route.params?.selectedBook) {
      setSelectedBook(route.params.selectedBook);
      setFormData({
        id: route.params.selectedBook.id,
        bookNumber: route.params.selectedBook.bookNumber,
        bookName: route.params.selectedBook.bookName,
        subject: route.params.selectedBook.subject,
        available: route.params.selectedBook.available ? 'true' : 'false',
        status: route.params.selectedBook.status || 'active',
        author: route.params.selectedBook.author,
        isbn: route.params.selectedBook.isbn,
        publisher: route.params.selectedBook.publisher,
        year: route.params.selectedBook.year?.toString() || new Date().getFullYear().toString(),
      });
    } else {
      Alert.alert(
        'No Book Selected',
        'Please select a book to update',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [route.params]);

  const subjects = ['Science', 'Mathematics', 'Language', 'Social Studies', 'Literature', 'History', 'Technology', 'Arts'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.publisher.trim()) newErrors.publisher = 'Publisher is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';

    // ISBN format validation (basic)
    if (formData.isbn.trim() && !/^[\d-]{10,}$/.test(formData.isbn)) {
      newErrors.isbn = 'Invalid ISBN format';
    }

    // Year validation
    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      newErrors.year = `Year must be between 1900 and ${new Date().getFullYear()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      // const response = await axios.put(`http://localhost:5000/api/library/${formData.id}`, formData);

      // For now, just show success
      Alert.alert(
        'Success',
        `Book "${formData.bookName}" updated successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (selectedBook) {
      setFormData({
        id: selectedBook.id,
        bookNumber: selectedBook.bookNumber,
        bookName: selectedBook.bookName,
        subject: selectedBook.subject,
        available: selectedBook.available ? 'true' : 'false',
        status: selectedBook.status || 'active',
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        publisher: selectedBook.publisher,
        year: selectedBook.year?.toString() || new Date().getFullYear().toString(),
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    if (
      formData.author !== selectedBook.author ||
      formData.subject !== selectedBook.subject ||
      formData.available !== (selectedBook.available ? 'true' : 'false') ||
      formData.isbn !== selectedBook.isbn ||
      formData.publisher !== selectedBook.publisher ||
      formData.year !== selectedBook.year?.toString()
    ) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard all changes?',
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

  if (!selectedBook) {
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
              <Title style={styles.headerTitle}>Update Book</Title>
              <Text style={styles.headerSubtitle}>Edit book details (Book Number & Name are read-only)</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="pencil-circle" size={40} color="#2196F3" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Form Card */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Book Information</Text>
          <Divider style={styles.divider} />

          {/* Book Number - Read Only */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Number (Read-Only)</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={formData.bookNumber}
              editable={false}
              mode="outlined"
              outlineColor="#ccc"
            />
          </View>

          {/* Book Name - Read Only */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Name (Read-Only)</Text>
            <TextInput
              style={styles.readOnlyInput}
              value={formData.bookName}
              editable={false}
              mode="outlined"
              outlineColor="#ccc"
            />
          </View>

          {/* Subject */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.subject}
                onValueChange={(value) => handleInputChange('subject', value)}
                style={styles.picker}
              >
                {subjects.map((subject) => (
                  <Picker.Item key={subject} label={subject} value={subject} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Author */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Author <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., John Smith"
              value={formData.author}
              onChangeText={(value) => handleInputChange('author', value)}
              mode="outlined"
              outlineColor={errors.author ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.author ? '#F44336' : '#2196F3'}
            />
            {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
          </View>

          {/* ISBN */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              ISBN <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 978-0-12345-001-0"
              value={formData.isbn}
              onChangeText={(value) => handleInputChange('isbn', value)}
              mode="outlined"
              outlineColor={errors.isbn ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.isbn ? '#F44336' : '#2196F3'}
            />
            {errors.isbn && <Text style={styles.errorText}>{errors.isbn}</Text>}
          </View>

          {/* Publisher */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Publisher <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Academic Press"
              value={formData.publisher}
              onChangeText={(value) => handleInputChange('publisher', value)}
              mode="outlined"
              outlineColor={errors.publisher ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.publisher ? '#F44336' : '#2196F3'}
            />
            {errors.publisher && <Text style={styles.errorText}>{errors.publisher}</Text>}
          </View>

          {/* Year */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Publication Year <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={new Date().getFullYear().toString()}
              value={formData.year}
              onChangeText={(value) => handleInputChange('year', value)}
              mode="outlined"
              keyboardType="number-pad"
              outlineColor={errors.year ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.year ? '#F44336' : '#2196F3'}
            />
            {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
          </View>

          {/* Availability */}
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <Icon name="package-variant" size={18} color="#2196F3" />
              <Text style={styles.label}>Availability</Text>
            </View>
            <View style={[styles.pickerContainer, { borderColor: '#2196F3', borderWidth: 2, backgroundColor: '#E3F2FD' }]}>
              <Picker
                selectedValue={formData.available}
                onValueChange={(value) => handleInputChange('available', value)}
                style={styles.picker}
              >
                <Picker.Item label="Available" value="true" />
                <Picker.Item label="Not Available" value="false" />
              </Picker>
            </View>
          </View>

          {/* Status - Only visible when Available */}
          {formData.available === 'true' && (
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <Icon name="check-circle-outline" size={18} color="#4CAF50" />
                <Text style={styles.label}>Status</Text>
              </View>
              <View style={[styles.pickerContainer, { borderColor: '#4CAF50', borderWidth: 2, backgroundColor: '#F1F8E9' }]}>
                <Picker
                  selectedValue={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Not Active" value="inactive" />
                </Picker>
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.actionButton, styles.submitButton]}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              disabled={loading}
              style={[styles.actionButton, styles.resetButton]}
            >
              <Icon name="restart" size={20} color="#fff" />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              disabled={loading}
              style={[styles.actionButton, styles.cancelButton]}
            >
              <Icon name="close-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
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
    color: '#2196F3',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#E3F2FD',
    borderRadius: 50,
    padding: 12,
  },
  formCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  required: {
    color: '#F44336',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0',
    fontSize: 14,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 55,
    fontSize: 14,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#2196F3',
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  bottomPadding: {
    height: 20,
  },
});

export default UpdateBookScreen;
