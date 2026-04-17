import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {
  Card,
  Button,
  Text,
  IconButton,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getContactDetails } from '../utils/contactApi';

const { width, height } = Dimensions.get('window');

const IndexScreen = ({ navigation }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contactDetails, setContactDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle Contact Us navigation with API call
   */
  const handleContactUsPress = async () => {
    console.log('[IndexScreen] Contact Us button pressed');
    setLoading(true);
    try {
      console.log('[IndexScreen] Attempting to fetch contact details from API...');
      const response = await getContactDetails();
      
      console.log('[IndexScreen] Contact details fetched successfully');
      console.log('[IndexScreen] Response data:', response);
      
      setContactDetails(response);
      
      console.log('[IndexScreen] Navigating to ContactUs with contact details...');
      console.log('[IndexScreen] Data being passed:', response);
      
      navigation.navigate('ContactUs', { contactDetails: response });
    } catch (error) {
      console.error('[IndexScreen] Error fetching contact details:', error.message);
      Alert.alert(
        'Error',
        'Failed to load contact details. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Videos',
      icon: 'play-circle',
      route: 'Videos',
      color: '#FF6B6B',
      description: 'School channel videos',
    },
    {
      id: 2,
      title: 'Photo Gallery',
      icon: 'image-multiple',
      route: 'PhotoGallery',
      color: '#4ECDC4',
      description: 'School events',
    },
    {
      id: 3,
      title: 'About Us',
      icon: 'information',
      route: 'AboutUs',
      color: '#45B7D1',
      description: 'School info',
    },
    {
      id: 4,
      title: 'Contact Us',
      icon: 'phone',
      route: 'ContactUs',
      color: '#F7DC6F',
      description: 'Get in touch',
    },
    {
      id: 5,
      title: 'PlaceHolder',
      icon: 'star',
      route: 'Placeholder',
      color: '#BB8FCE',
      description: 'Coming soon',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      {/* Header with Login Button */}
      <View style={[styles.header, styles.headerBackground]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Icon name="school" size={40} color="#FFFFFF" />
            <Text style={styles.logoText}>MySchool</Text>
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Icon name="login" size={20} color="#1A237E" />
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, styles.heroBackground]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Welcome to MySchool</Text>
            <Text style={styles.heroSubtitle}>
              Explore our community, events, and more
            </Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCard}
                onPress={() => {
                  if (item.route === 'ContactUs') {
                    handleContactUsPress();
                  } else {
                    navigation.navigate(item.route);
                  }
                }}
                activeOpacity={0.7}
                disabled={loading}
              >
                <View
                  style={[styles.cardGradient, { backgroundColor: item.color }]}
                >
                  <Icon name={item.icon} size={40} color="#FFFFFF" />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured</Text>
          
          <Card style={styles.featuredCard}>
            <Card.Cover
              source={{
                uri: 'https://images.unsplash.com/photo-1427504494785-cdfc993e38ae?w=400&h=250&fit=crop',
              }}
              style={styles.cardCover}
            />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Latest School News</Text>
              <Text style={styles.cardDescription}>
                Stay updated with the latest events and announcements from our school
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AboutUs')}
                labelStyle={styles.buttonLabel}
              >
                Learn More
              </Button>
            </Card.Actions>
          </Card>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>School Highlights</Text>
          <View style={styles.statsContainer}>
            {[
              { label: 'Students', value: '2000+', icon: 'account-multiple' },
              { label: 'Events', value: '50+', icon: 'calendar-multiple' },
              { label: 'Years', value: '25+', icon: 'clock' },
            ].map((stat, index) => (
              <View key={index} style={styles.statBox}>
                <Icon name={stat.icon} size={30} color="#3F51B5" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Card style={styles.ctaCard}>
            <Card.Content style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Ready to Join Us?</Text>
              <Text style={styles.ctaDescription}>
                Create an account to access exclusive content and stay connected
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Register')}
                style={styles.ctaButton}
                labelStyle={styles.ctaButtonLabel}
                disabled={true}
              >
                Register Now
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 MySchool. All rights reserved.</Text>
          <View style={styles.socialLinks}>
            <IconButton icon="facebook" iconColor="#3B5998" size={24} />
            <IconButton icon="twitter" iconColor="#1DA1F2" size={24} />
            <IconButton icon="instagram" iconColor="#E4405F" size={24} />
          </View>
        </View>
      </ScrollView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A237E',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackground: {
    backgroundColor: '#283593',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E8EAF6',
    textAlign: 'center',
    opacity: 0.9,
  },
  menuSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 16,
    paddingLeft: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
  featuredSection: {
    padding: 16,
  },
  featuredCard: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardCover: {
    height: 200,
  },
  cardContent: {
    paddingTop: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  ctaSection: {
    padding: 16,
  },
  ctaCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F4FF',
  },
  ctaContent: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    marginTop: 8,
    backgroundColor: '#3F51B5',
    paddingVertical: 4,
  },
  ctaButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default IndexScreen;
