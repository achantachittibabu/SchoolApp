import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  Text,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const AboutUsScreen = ({ navigation }) => {
  const missions = [
    {
      icon: 'target',
      title: 'Our Mission',
      description: 'To provide quality education and foster innovation in students to create leaders of tomorrow.',
    },
    {
      icon: 'eye',
      title: 'Our Vision',
      description: 'To be a leading educational institution recognized for excellence and holistic development.',
    },
    {
      icon: 'heart',
      title: 'Our Values',
      description: 'Integrity, Excellence, Inclusivity, and Respect for all members of our community.',
    },
  ];

  const highlights = [
    { number: '2000+', label: 'Students', icon: 'account-multiple' },
    { number: '150+', label: 'Faculty Members', icon: 'briefcase' },
    { number: '50+', label: 'Annual Events', icon: 'calendar-multiple' },
    { number: '25+', label: 'Years of Excellence', icon: 'star' },
  ];

  const facilities = [
    { icon: 'library-shelves', title: 'Library' },
    { icon: 'microscope', title: 'Science Labs' },
    { icon: 'laptop', title: 'Computer Lab' },
    { icon: 'soccer', title: 'Sports Ground' },
    { icon: 'palette', title: 'Art Studio' },
    { icon: 'music', title: 'Music Room' },
  ];

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
          <Text style={styles.headerTitle}>About Us</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* School Intro Section */}
        <View style={[styles.introSection, styles.introBackground]}>
          <Icon name="school" size={60} color="#FFFFFF" />
          <Text style={styles.schoolName}>MySchool Academy</Text>
          <Text style={styles.schoolTagline}>Inspiring Young Minds</Text>
        </View>

        {/* Mission, Vision, Values */}
        <View style={styles.missionSection}>
          <Text style={styles.sectionTitle}>Core Values</Text>
          {missions.map((mission, index) => (
            <Card key={index} style={styles.missionCard}>
              <View style={styles.missionContent}>
                <Icon name={mission.icon} size={32} color="#3F51B5" />
                <View style={styles.missionText}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDesc}>{mission.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <Text style={styles.sectionTitle}>School Highlights</Text>
          <View style={styles.highlightGrid}>
            {highlights.map((highlight, index) => (
              <Card key={index} style={styles.highlightCard}>
                <View style={styles.highlightContent}>
                  <Icon name={highlight.icon} size={28} color="#FF6B6B" />
                  <Text style={styles.highlightNumber}>{highlight.number}</Text>
                  <Text style={styles.highlightLabel}>{highlight.label}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Facilities Section */}
        <View style={styles.facilitiesSection}>
          <Text style={styles.sectionTitle}>Our Facilities</Text>
          <View style={styles.facilityGrid}>
            {facilities.map((facility, index) => (
              <Card key={index} style={styles.facilityCard}>
                <View
                  style={[styles.facilityGradient, styles.facilityBackground]}
                >
                  <Icon name={facility.icon} size={32} color="#FFFFFF" />
                  <Text style={styles.facilityName}>{facility.title}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* History Section */}
        <Card style={styles.historyCard}>
          <View style={styles.historyContent}>
            <Text style={styles.sectionTitle}>Our History</Text>
            <Text style={styles.historyText}>
              Founded in 1999, MySchool Academy has been committed to providing quality education
              and nurturing young talents for over 25 years. Our institution has consistently
              maintained high academic standards while fostering creativity, critical thinking,
              and ethical values among our students.
            </Text>
            <Text style={styles.historyText}>
              With state-of-the-art facilities and a team of dedicated educators, we continue to
              evolve and provide the best learning environment for our students.
            </Text>
          </View>
        </Card>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Join Our Community</Text>
            <Text style={styles.ctaDesc}>Become a part of MySchool Academy today</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Register')}
              style={styles.ctaButton}
              labelStyle={styles.ctaButtonLabel}
              disabled={true}
            >
              Enroll Now
            </Button>
          </View>
        </Card>

        {/* Footer Spacing */}
        <View style={{ height: 20 }} />
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
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introBackground: {
    backgroundColor: '#283593',
  },
  schoolName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  schoolTagline: {
    fontSize: 14,
    color: '#E8EAF6',
    marginTop: 4,
    fontStyle: 'italic',
  },
  missionSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 16,
  },
  missionCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  missionContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  missionText: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  highlightsSection: {
    padding: 16,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  highlightCard: {
    width: '48%',
    borderRadius: 12,
    elevation: 2,
  },
  highlightContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 8,
  },
  highlightLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textAlign: 'center',
  },
  facilitiesSection: {
    padding: 16,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  facilityCard: {
    width: '31%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  facilityGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityBackground: {
    backgroundColor: '#45B7D1',
  },
  facilityName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  historyCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  historyContent: {
    padding: 16,
  },
  historyText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'justify',
  },
  ctaCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    elevation: 2,
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
  ctaDesc: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    marginTop: 8,
    backgroundColor: '#3F51B5',
    paddingVertical: 2,
  },
  ctaButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 5,
  },
});

export default AboutUsScreen;
