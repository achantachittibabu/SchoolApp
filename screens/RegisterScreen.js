import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Picker,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    // Account Info
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadharNumber: '',
    contactNumber: '',
    dateOfJoin: '',
    grade: '',
    classValue: '',
    classTeacher: '',

    // Parent Information
    fatherName: '',
    motherName: '',
    fatherAadharNumber: '',
    motherAadharNumber: '',
    fatherOccupation: '',

    // Present Address
    addressType: 'present',
    presentHouseNo: '',
    presentStreet: '',
    presentArea: '',
    presentLandmark: '',
    presentDistrict: '',
    presentState: '',
    presentPincode: '',
    presentPhone: '',
    sameAddress: false,

    // Permanent Address
    permanentHouseNo: '',
    permanentStreet: '',
    permanentArea: '',
    permanentLandmark: '',
    permanentDistrict: '',
    permanentState: '',
    permanentPincode: '',
    permanentPhone: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const userTypes = ['student', 'teacher', 'admin'];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Account validation
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email');
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    // Personal Information validation
    if (!formData.firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter last name');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    console.log('=== REGISTRATION STARTED ===');
    console.log('Form Data:', {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      filesCount: uploadedFiles.length,
    });

    if (!validateForm()) {
      console.log('Validation failed - aborting');
      return;
    }

    console.log('Validation passed - proceeding with FormData creation');
    setLoading(true);
    try {
      // Create FormData for multipart/form-data request
      const uploadFormData = new FormData();

      // Add all registration fields
      uploadFormData.append('username', formData.firstName.trim() + '_' + formData.lastName.trim());
      uploadFormData.append('email', formData.email);
      uploadFormData.append('phone', formData.phone);
      uploadFormData.append('password', formData.password);
      uploadFormData.append('confirmPassword', formData.confirmPassword);
      uploadFormData.append('userType', formData.userType);
      
      // Personal Information
      uploadFormData.append('firstName', formData.firstName.trim());
      uploadFormData.append('lastName', formData.lastName.trim());
      uploadFormData.append('dateOfBirth', formData.dateOfBirth);
      uploadFormData.append('aadharNumber', formData.aadharNumber.trim());
      uploadFormData.append('contactNumber', formData.contactNumber.trim());
      uploadFormData.append('dateOfJoin', formData.dateOfJoin);
      uploadFormData.append('grade', formData.grade);
      uploadFormData.append('class', formData.classValue);
      uploadFormData.append('classTeacher', formData.classTeacher);

      // Parent Information
      uploadFormData.append('fatherName', formData.fatherName.trim());
      uploadFormData.append('motherName', formData.motherName.trim());
      uploadFormData.append('fatherAadharNumber', formData.fatherAadharNumber.trim());
      uploadFormData.append('motherAadharNumber', formData.motherAadharNumber.trim());
      uploadFormData.append('fatherOccupation', formData.fatherOccupation.trim());

      // Present Address
      uploadFormData.append('addressType', formData.addressType);
      uploadFormData.append('presentHouseNo', formData.presentHouseNo.trim());
      uploadFormData.append('presentStreet', formData.presentStreet.trim());
      uploadFormData.append('presentArea', formData.presentArea.trim());
      uploadFormData.append('presentLandmark', formData.presentLandmark.trim());
      uploadFormData.append('presentDistrict', formData.presentDistrict.trim());
      uploadFormData.append('presentState', formData.presentState.trim());
      uploadFormData.append('presentPincode', formData.presentPincode.trim());
      uploadFormData.append('presentPhone', formData.presentPhone.trim());
      uploadFormData.append('sameAddress', formData.sameAddress);

      // Permanent Address
      uploadFormData.append('addressType', formData.addressType);
      uploadFormData.append('permanentHouseNo', formData.permanentHouseNo.trim());
      uploadFormData.append('permanentStreet', formData.permanentStreet.trim());
      uploadFormData.append('permanentArea', formData.permanentArea.trim());
      uploadFormData.append('permanentLandmark', formData.permanentLandmark.trim());
      uploadFormData.append('permanentDistrict', formData.permanentDistrict.trim());
      uploadFormData.append('permanentState', formData.permanentState.trim());
      uploadFormData.append('permanentPincode', formData.permanentPincode.trim());
      uploadFormData.append('permanentPhone', formData.permanentPhone.trim());

      // Add all uploaded files
      uploadedFiles.forEach((file, index) => {
        console.log(`Appending file ${index + 1}:`, file.name);
        uploadFormData.append('documents', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      });

      console.log('=== REQUEST DETAILS ===');
      console.log('URL:', 'http://localhost:5000/api/users/');
      console.log('Files attached:', uploadedFiles.length);
      uploadedFiles.forEach((file) => console.log('  -', file.name));
      
      const response = await axios.post('http://127.0.0.1:5000/api/users/', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      setLoading(false);

      if (response.status == 200 || response.status == 201 || response.statusText == 'Created') {
        console.log('=== REGISTRATION SUCCESS ===');
        console.log('Response Status:', response.status);
        
        Alert.alert('Success', 'Registration successful! Redirecting to home screen...', [
          {
            text: 'OK',
          },
        ]);
        
        // Navigate to Index screen after 3 seconds with success message
        setTimeout(() => {
          navigation.navigate('Index', {
            message: 'Registration completed successfully!',
            type: 'success',
          });
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      console.error('=== REGISTRATION ERROR ===');
      console.error('Error Message:', error.message);
      console.error('Status Code:', error.response?.status);
      console.error('Error Response:', error.response?.data);

      navigation.navigate('Failure', {
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    }
  };

  const handleClear = () => {
    setFormData({
      // Account Info
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userType: 'student',
      
      // Personal Information
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      aadharNumber: '',
      contactNumber: '',
      dateOfJoin: '',
      grade: '',
      classValue: '',
      classTeacher: '',

      // Parent Information
      fatherName: '',
      motherName: '',
      fatherAadharNumber: '',
      motherAadharNumber: '',
      fatherOccupation: '',

      // Present Address
      addressType: 'present',
      presentHouseNo: '',
      presentStreet: '',
      presentArea: '',
      presentLandmark: '',
      presentDistrict: '',
      presentState: '',
      presentPincode: '',
      presentPhone: '',
      sameAddress: false,

      // Permanent Address
      permanentHouseNo: '',
      permanentStreet: '',
      permanentArea: '',
      permanentLandmark: '',
      permanentDistrict: '',
      permanentState: '',
      permanentPincode: '',
      permanentPhone: '',
    });
    setUploadedFiles([]);
  };

  const imageUploader = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
      });
      console.log("File pick result:", JSON.stringify(result));

      if (result.canceled) {
        console.log('Image selection cancelled by user');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No image selected');
        return;
      }

      const asset = result.assets[0];
      console.log('Selected asset:', asset);

      const newFile = {
        id: Date.now() + Math.random(),
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'image/jpeg',
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      Alert.alert('Success', `📷 ${asset.name} added to upload`);
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to select image: ' + err.message);
    }
  };

  const fileUploader = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });
      console.log("File pick result:", JSON.stringify(result));

      if (result.canceled) {
        console.log('File selection cancelled by user');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'No document selected');
        return;
      }

      const asset = result.assets[0];
      console.log('Selected asset:', asset);

      const newFile = {
        id: Date.now() + Math.random(),
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType || 'application/octet-stream',
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      Alert.alert('Success', `📄 ${asset.name} added to upload`);
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert('Error', 'Failed to select document: ' + err.message);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register for MySchool App</Text>

        {/* ===== ACCOUNT SECTION ===== */}
        <Text style={styles.sectionTitle}>Account Information</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* User Type Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
            disabled={loading}
          >
            <Text style={styles.dropdownText}>{formData.userType}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {userTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.dropdownItem,
                    formData.userType === type && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    updateFormData('userType', type);
                    setShowDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      formData.userType === type && styles.dropdownItemTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* ===== PERSONAL INFORMATION SECTION ===== */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfBirth}
            onChangeText={(value) => updateFormData('dateOfBirth', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Aadhar Number</Text>
          <TextInput
            style={styles.input}
            placeholder="12-digit Aadhar number"
            value={formData.aadharNumber}
            onChangeText={(value) => updateFormData('aadharNumber', value)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChangeText={(value) => updateFormData('contactNumber', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Join</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.dateOfJoin}
            onChangeText={(value) => updateFormData('dateOfJoin', value)}
            editable={!loading}
          />
        </View>

        {formData.userType === 'student' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Grade</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter grade"
                value={formData.grade}
                onChangeText={(value) => updateFormData('grade', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Class</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter class"
                value={formData.classValue}
                onChangeText={(value) => updateFormData('classValue', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Class Teacher</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter class teacher name"
                value={formData.classTeacher}
                onChangeText={(value) => updateFormData('classTeacher', value)}
                editable={!loading}
              />
            </View>
          </>
        )}

        {/* ===== PARENT INFORMATION SECTION ===== */}
        {formData.userType === 'student' && (
          <>
            <Text style={styles.sectionTitle}>Parent Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Father Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter father name"
                value={formData.fatherName}
                onChangeText={(value) => updateFormData('fatherName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mother Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mother name"
                value={formData.motherName}
                onChangeText={(value) => updateFormData('motherName', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Father Aadhar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="12-digit Aadhar number"
                value={formData.fatherAadharNumber}
                onChangeText={(value) => updateFormData('fatherAadharNumber', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mother Aadhar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="12-digit Aadhar number"
                value={formData.motherAadharNumber}
                onChangeText={(value) => updateFormData('motherAadharNumber', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Father Occupation</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter father occupation"
                value={formData.fatherOccupation}
                onChangeText={(value) => updateFormData('fatherOccupation', value)}
                editable={!loading}
              />
            </View>
          </>
        )}

        {/* ===== PRESENT ADDRESS SECTION ===== */}
        <Text style={styles.sectionTitle}>Present Address</Text>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={formData.sameAddress ? 'checked' : 'unchecked'}
            onPress={() => updateFormData('sameAddress', !formData.sameAddress)}
            disabled={loading}
          />
          <Text style={styles.checkboxLabel}>Same as Present Address</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>House No.</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter house number"
            value={formData.presentHouseNo}
            onChangeText={(value) => updateFormData('presentHouseNo', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street name"
            value={formData.presentStreet}
            onChangeText={(value) => updateFormData('presentStreet', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Area Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area name"
            value={formData.presentArea}
            onChangeText={(value) => updateFormData('presentArea', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Land Mark</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter landmark"
            value={formData.presentLandmark}
            onChangeText={(value) => updateFormData('presentLandmark', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>District Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter district name"
            value={formData.presentDistrict}
            onChangeText={(value) => updateFormData('presentDistrict', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>State Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter state name"
            value={formData.presentState}
            onChangeText={(value) => updateFormData('presentState', value)}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pincode"
            value={formData.presentPincode}
            onChangeText={(value) => updateFormData('presentPincode', value)}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={formData.presentPhone}
            onChangeText={(value) => updateFormData('presentPhone', value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* ===== PERMANENT ADDRESS SECTION ===== */}
        {!formData.sameAddress && (
          <>
            <Text style={styles.sectionTitle}>Permanent Address</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>House No.</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter house number"
                value={formData.permanentHouseNo}
                onChangeText={(value) => updateFormData('permanentHouseNo', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Street Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter street name"
                value={formData.permanentStreet}
                onChangeText={(value) => updateFormData('permanentStreet', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Area Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter area name"
                value={formData.permanentArea}
                onChangeText={(value) => updateFormData('permanentArea', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Land Mark</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter landmark"
                value={formData.permanentLandmark}
                onChangeText={(value) => updateFormData('permanentLandmark', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>District Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter district name"
                value={formData.permanentDistrict}
                onChangeText={(value) => updateFormData('permanentDistrict', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>State Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter state name"
                value={formData.permanentState}
                onChangeText={(value) => updateFormData('permanentState', value)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pincode"
                value={formData.permanentPincode}
                onChangeText={(value) => updateFormData('permanentPincode', value)}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={formData.permanentPhone}
                onChangeText={(value) => updateFormData('permanentPhone', value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
          </>
        )}

        {/* File Upload Section */}
        <Text style={styles.sectionTitle}>Upload Documents</Text>

        <View style={styles.fileButtonGroup}>
          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.buttonDisabled]}
            onPress={imageUploader}
            disabled={loading}
          >
            <Text style={styles.uploadButtonText}>📷 Add Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, loading && styles.buttonDisabled]}
            onPress={fileUploader}
            disabled={loading}
          >
            <Text style={styles.uploadButtonText}>📄 Add Document</Text>
          </TouchableOpacity>
        </View>

        {uploadedFiles.length > 0 && (
          <View style={styles.fileListContainer}>
            <Text style={styles.fileListTitle}>Uploaded Files ({uploadedFiles.length})</Text>
            {uploadedFiles.map((file) => (
              <View key={file.id} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileType}>{file.type}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeFile(file.id)}
                  disabled={loading}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    paddingLeft: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#007AFF',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
    marginTop: -8,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: '#e8f4ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  dropdownItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF9500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  uploadButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#E8F4FF',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  fileButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  fileListContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  fileType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '600',
  },
  selectedFileText: {
    fontSize: 12,
    color: '#34C759',
    marginBottom: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
