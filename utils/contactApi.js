import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api'; // Update this with your actual backend URL

/**
 * Backend Endpoint Documentation:
 * 
 * POST /contact/message
 * 
 * Expected Request Body:
 * {
 *   "name": "string - User's full name",
 *   "emailId": "string - User's email address",
 *   "message": "string - User's message",
 *   "recipientEmail": "string - admin email (achantachittibabu@gmail.com)",
 *   "timestamp": "string - ISO timestamp when message was sent"
 * }
 * 
 * Expected Response:
 * {
 *   "success": true,
 *   "message": "string - confirmation message",
 *   "data": { ...response data },
 *   "timestamp": "string - ISO timestamp"
 * }
 * 
 * The backend should:
 * 1. Validate all required fields (name, emailId, message)
 * 2. Send email to recipientEmail with user details
 * 3. Optionally store message in database
 * 4. Return success response with confirmation
 */

/**
 * Fetch contact details from the backend
 * @returns {Promise} Contact details response
 */
export const getContactDetails = async () => {
  try {
    console.log('[API] Fetching contact details from backend...');
    const response = await axios.get(`${API_BASE_URL}/contactDetails`);
    
    console.log('[API] Response received:', response.status);
    console.log('[API] Contact Details:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('[API] Error fetching contact details:', error.message);
    console.error('[API] Full error:', error);
    throw error;
  }
};

/**
 * Submit contact form message to the backend
 * Sends user's contact details (name, email, message) to backend server
 * and triggers email notification to achantachittibabu@gmail.com
 * 
 * @param {Object} formData - Form data object containing:
 *   - name: User's full name
 *   - email: User's email address
 *   - message: User's message content
 * @returns {Promise} API response with email status and confirmation
 */
export const submitContactMessage = async (formData) => {
  try {
    console.log('[API] Submitting contact message...', formData);
    
    // Prepare payload with recipient email address
    const payload = {
      messagename: formData.name,
      emailId: formData.email,
      message: formData.message,
      recipientEmail: 'achantachittibabu@gmail.com', // Email recipient
      timestamp: new Date().toISOString(),
    };
    
    console.log('[API] Sending payload to backend:', payload);
    
    // Send request to backend API to process form and send email
    const response = await axios.post(`${API_BASE_URL}/messages`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    console.log('[API] Message submitted successfully:', response.status);
    console.log('[API] Server response:', response.data);
    console.log('[API] Email sent to: achantachittibabu@gmail.com');
    
    // Return response data for UI rendering
    return {
      success: true,
      message: response.data.message || 'Message sent successfully!',
      data: response.data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[API] Error submitting contact message:', error.message);
    console.error('[API] Full error:', error);
    
    // Provide detailed error response
    const errorResponse = {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to send message',
      error: error.response?.data || error.message,
      timestamp: new Date().toISOString(),
    };
    
    console.error('[API] Error response:', errorResponse);
    throw errorResponse;
  }
};
