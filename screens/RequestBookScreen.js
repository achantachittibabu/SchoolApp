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
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RequestBookScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.userData) setUser(route.params.userData);
    if (route.params?.book) {
      setBook(route.params.book);
      // Set default return date to 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setReturnDate(defaultDate);
    } else {
      Alert.alert(
        'Error',
        'Book information not found',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [route.params]);

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    return isNaN(date.getTime()) ? null : date;
  };

  const setQuickDate = (daysFromNow) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysFromNow);
    newDate.setHours(0, 0, 0, 0);
    setReturnDate(newDate);
    if (errors.returnDate) {
      setErrors({ ...errors, returnDate: undefined });
    }
  };

  const handleDateChange = (dateString) => {
    const parsedDate = parseDate(dateString);
    if (!dateString.trim()) {
      setReturnDate(null);
      return;
    }
    
    if (!parsedDate) {
      setErrors({ ...errors, returnDate: 'Invalid date format. Use DD/MM/YYYY' });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    maxDate.setHours(23, 59, 59, 999);

    if (parsedDate < today) {
      setErrors({ ...errors, returnDate: 'Please select today or a future date' });
      return;
    }

    if (parsedDate > maxDate) {
      setErrors({ ...errors, returnDate: 'Return date cannot be more than 7 days from today' });
      return;
    }

    setReturnDate(parsedDate);
    if (errors.returnDate) {
      setErrors({ ...errors, returnDate: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    if (!comments.trim()) {
      newErrors.comments = 'Comments are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      // const response = await axios.post('http://localhost:5000/api/book-requests', {
      //   bookId: book.id,
      //   userId: user?.id,
      //   returnDate,
      //   comments,
      // });

      // For now, show success
      Alert.alert(
        'Request Submitted',
        `Book "${book.bookName}" request has been submitted successfully!\n\nReturn by: ${formatDate(returnDate)}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (comments.trim()) {
      Alert.alert(
        'Discard Request?',
        'Are you sure you want to discard this request?',
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
              <Title style={styles.headerTitle}>Request Book</Title>
              <Text style={styles.headerSubtitle}>Submit your book request</Text>
            </View>
            <View style={styles.headerIcon}>
              <Icon name="hand-right" size={40} color="#4CAF50" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Book Details Card */}
      <Card style={styles.detailCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Book Details</Text>
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
        </Card.Content>
      </Card>

      {/* Request Form Card */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Request Information</Text>
          <Divider style={styles.divider} />

          {/* Return Date Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Return Date By <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.helperText}>(Current date to +7 days only)</Text>
            
            <TextInput
              style={[styles.input, styles.dateInput]}
              placeholder="DD/MM/YYYY"
              value={returnDate ? formatDate(returnDate) : ''}
              onChangeText={handleDateChange}
              mode="outlined"
              editable={false}
              outlineColor={errors.returnDate ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.returnDate ? '#F44336' : '#4CAF50'}
            />

            {/* Quick Date Buttons */}
            <View style={styles.quickDateButtonsRow}>
              <TouchableOpacity
                onPress={() => setQuickDate(1)}
                style={[styles.quickDateButton, returnDate && returnDate.getDate() === new Date(new Date().setDate(new Date().getDate() + 1)).getDate() && styles.quickDateButtonActive]}
              >
                <Text style={styles.quickDateButtonText}>+1 Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setQuickDate(3)}
                style={[styles.quickDateButton, returnDate && returnDate.getDate() === new Date(new Date().setDate(new Date().getDate() + 3)).getDate() && styles.quickDateButtonActive]}
              >
                <Text style={styles.quickDateButtonText}>+3 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setQuickDate(7)}
                style={[styles.quickDateButton, returnDate && returnDate.getDate() === new Date(new Date().setDate(new Date().getDate() + 7)).getDate() && styles.quickDateButtonActive]}
              >
                <Text style={styles.quickDateButtonText}>+7 Days</Text>
              </TouchableOpacity>
            </View>

            {errors.returnDate && <Text style={styles.errorText}>{errors.returnDate}</Text>}
          </View>

          {/* Comments Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Comments <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.commentInput]}
              placeholder="Enter your request comments..."
              value={comments}
              onChangeText={(text) => {
                setComments(text);
                if (errors.comments) {
                  setErrors({ ...errors, comments: undefined });
                }
              }}
              mode="outlined"
              multiline
              numberOfLines={4}
              outlineColor={errors.comments ? '#F44336' : '#e0e0e0'}
              activeOutlineColor={errors.comments ? '#F44336' : '#4CAF50'}
            />
            {errors.comments && <Text style={styles.errorText}>{errors.comments}</Text>}
          </View>

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.actionButton, styles.submitButton]}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Submit Request</Text>
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
    color: '#4CAF50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  headerIcon: {
    backgroundColor: '#E8F5E9',
    borderRadius: 50,
    padding: 12,
  },
  detailCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
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
  formGroup: {
    marginBottom: 16,
  },
  required: {
    color: '#F44336',
    fontWeight: '700',
  },
  helperText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
    marginBottom: 8,
  },
  quickDateButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  quickDateButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  quickDateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  commentInput: {
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
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
    backgroundColor: '#4CAF50',
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

export default RequestBookScreen;
