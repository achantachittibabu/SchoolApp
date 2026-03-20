import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import {
  Card,
  Button,
  Text,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { submitContactMessage } from '../utils/contactApi';

const ContactUsScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [contactMethods, setContactMethods] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Initialize contact methods from API response
   */
  useEffect(() => {
    console.log('[ContactUsScreen] Component mounted');
    console.log('[ContactUsScreen] Route params:', route.params);
    
    if (route.params && route.params.contactDetails) {
      const apiContactDetails = route.params.contactDetails;
      console.log('[ContactUsScreen] Contact details received from Navigation:', apiContactDetails);
      
      // Map API response to contact methods format
      const mappedMethods = [
        {
          icon: 'phone',
          title: 'Phone',
          value: apiContactDetails.data[0].phoneNumber || '+1 (555) 123-4567',
          color: '#FF6B6B',
          action: () => {
            const phone = apiContactDetails.data[0].phoneNumber || '+15551234567';
            console.log('[ContactUsScreen] Initiating phone call to:', phone);
            Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
          },
        },
        {
          icon: 'email',
          title: 'Email',
          value: apiContactDetails.data[0].emailId || 'info@myschool.edu',
          color: '#4ECDC4',
          action: () => {
            const email = apiContactDetails.data[0].emailId || 'info@myschool.edu';
            console.log('[ContactUsScreen] Opening email to:', email);
            Linking.openURL(`mailto:${email}`);
          },
        },
        {
          icon: 'map-marker',
          title: 'Address',
          value: apiContactDetails.data[0].address || '123 School Street, City, ST 12345',
          color: '#45B7D1',
          action: () => {
            console.log('[ContactUsScreen] Opening maps');
            Linking.openURL('https://maps.google.com');
          },
        },
        {
          icon: 'clock',
          title: 'Working Hours',
          value: apiContactDetails.data[0].workingHours || 'Mon - Fri: 8:00 AM - 5:00 PM',
          color: '#F7DC6F',
          action: () => {
            console.log('[ContactUsScreen] Working Hours:', apiContactDetails.data[0].workingHours);
          },
        },
      ];
      
      console.log('[ContactUsScreen] Mapped contact methods:', mappedMethods);
      setContactMethods(mappedMethods);
    } else {
      console.log('[ContactUsScreen] No contact details from API, using defaults');
      // Default contact methods if no data from API
      setContactMethods([
        {
          icon: 'phone',
          title: 'Phone',
          value: '+1 (555) 123-4567',
          color: '#FF6B6B',
          action: () => Linking.openURL('tel:+15551234567'),
        },
        {
          icon: 'email',
          title: 'Email',
          value: 'info@myschool.edu',
          color: '#4ECDC4',
          action: () => Linking.openURL('mailto:info@myschool.edu'),
        },
        {
          icon: 'map-marker',
          title: 'Address',
          value: '123 School Street, City, ST 12345',
          color: '#45B7D1',
          action: () => Linking.openURL('https://maps.google.com'),
        },
        {
          icon: 'clock',
          title: 'Hours',
          value: 'Mon - Fri: 8:00 AM - 5:00 PM',
          color: '#F7DC6F',
          action: () => {},
        },
      ]);
    }
  }, [route.params]);

  const handleSendMessage = async () => {
    console.log('[ContactUsScreen] Send message button pressed');
    console.log('[ContactUsScreen] Form data:', formData);
    
    if (!formData.name || !formData.email || !formData.message) {
      console.warn('[ContactUsScreen] Form validation failed - missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSending(true);
    console.log('[ContactUsScreen] Setting sending state to true');
    
    try {
      console.log('[ContactUsScreen] Preparing to send message to backend...');
      console.log('[ContactUsScreen] Message payload:', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      
      // Call the API to submit the message
      const response = await submitContactMessage(formData);
      
      console.log('[ContactUsScreen] Message sent successfully');
      console.log('[ContactUsScreen] Server response:', response);
      
      // Reset the form immediately
      console.log('[ContactUsScreen] Resetting form data');
      setFormData({ name: '', email: '', message: '' });
      
      // Show success message
      setSuccessMessage(response.message || 'Message submitted successfully!');
      setShowSuccess(true);
      
    } catch (error) {
      console.error('[ContactUsScreen] Error sending message:', error.message);
      console.error('[ContactUsScreen] Full error details:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
      console.log('[ContactUsScreen] Setting sending state to false');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      {/* Header */}
      <View style={[styles.header, styles.headerBackground]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Intro Section */}
        <View style={styles.introSection}>
          <Icon name="headset" size={50} color="#3F51B5" />
          <Text style={styles.introTitle}>We'd Love to Hear From You</Text>
          <Text style={styles.introText}>
            Have any questions? Get in touch with us and our team will respond as soon as possible.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.contactMethodsSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactMethodCard}
              onPress={method.action}
              activeOpacity={0.7}
            >
              <View
                style={[styles.methodIconContainer, { backgroundColor: method.color }]}
              >
                <Icon name={method.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodValue}>{method.value}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <Card style={styles.formCard}>
            <View style={styles.formContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#CCCCCC"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Tell us what you need..."
                  placeholderTextColor="#CCCCCC"
                  multiline
                  numberOfLines={5}
                  value={formData.message}
                  onChangeText={(text) =>
                    setFormData({ ...formData, message: text })
                  }
                  textAlignVertical="top"
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSendMessage}
                disabled={sending}
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </View>
          </Card>
        </View>

        {/* Social Media Section */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#3B5998' }]}
              onPress={() =>
                Linking.openURL('https://facebook.com/myschool')
              }
            >
              <Icon name="facebook" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
              onPress={() => Linking.openURL('https://twitter.com/myschool')}
            >
              <Icon name="twitter" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
              onPress={() =>
                Linking.openURL('https://instagram.com/myschool')
              }
            >
              <Icon name="instagram" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#0A66C2' }]}
              onPress={() =>
                Linking.openURL('https://linkedin.com/company/myschool')
              }
            >
              <Icon name="linkedin" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Success Snackbar */}
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={3000}
        style={styles.successSnackbar}
      >
        <Text style={styles.snackbarText}>{successMessage}</Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackground: {
    backgroundColor: '#1A237E',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  introSection: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A237E',
    marginTop: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactMethodsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 16,
  },
  contactMethodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  methodIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodContent: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A237E',
  },
  methodValue: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  formSection: {
    padding: 16,
  },
  formCard: {
    borderRadius: 12,
    elevation: 2,
  },
  formContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A237E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  messageInput: {
    height: 120,
    paddingTop: 10,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#3F51B5',
    paddingVertical: 6,
  },
  submitButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  socialSection: {
    padding: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 2,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  snackbarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ContactUsScreen;
