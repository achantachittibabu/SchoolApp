import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const PlaceholderScreen = ({ navigation }) => {
  const scaleAnim = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

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
          <Text style={styles.headerTitle}>Coming Soon</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[
            styles.animatedIconContainer,
            {
              transform: [
                { scale },
                { rotate },
              ],
            },
          ]}
        >
          <View
            style={[styles.iconGradient, styles.iconBackground]}
          >
            <Icon name="rocket" size={80} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Text style={styles.mainTitle}>Something Exciting is Coming!</Text>
        <Text style={styles.subtitle}>
          We're working hard to bring you something amazing
        </Text>

        {/* Features Preview */}
        <Card style={styles.previewCard}>
          <View style={styles.previewContent}>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={24} color="#4ECDC4" />
              <Text style={styles.featureText}>New features in development</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={24} color="#4ECDC4" />
              <Text style={styles.featureText}>Enhanced user experience</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={24} color="#4ECDC4" />
              <Text style={styles.featureText}>Coming very soon</Text>
            </View>
          </View>
        </Card>

        {/* Timeline Section */}
        <Card style={styles.timelineCard}>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Launch Timeline</Text>
            <View style={styles.timelineItem}>
              <View style={styles.timelineMarker}>
                <Icon name="check" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelinePeriod}>Q1 2025</Text>
                <Text style={styles.timelineDesc}>Initial Development</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineMarker, { backgroundColor: '#F7DC6F' }]}>
                <Text style={styles.timelineMarkerText}>2</Text>
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelinePeriod}>Q2 2025</Text>
                <Text style={styles.timelineDesc}>Beta Testing</Text>
              </View>
            </View>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineMarker, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.timelineMarkerText}>3</Text>
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelinePeriod}>Q3 2025</Text>
                <Text style={styles.timelineDesc}>Official Launch</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Call to Action */}
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Index')}
          style={styles.ctaButton}
          labelStyle={styles.ctaButtonLabel}
        >
          Back to Home
        </Button>

        {/* Newsletter Signup */}
        <Card style={styles.newsletterCard}>
          <View style={styles.newsletterContent}>
            <Icon name="bell" size={28} color="#BB8FCE" />
            <Text style={styles.newsletterTitle}>Get Notified</Text>
            <Text style={styles.newsletterText}>
              Be the first to know when we launch
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.notifyButton}
              textColor="#BB8FCE"
              labelStyle={styles.notifyButtonLabel}
            >
              Notify Me
            </Button>
          </View>
        </Card>
      </View>

      {/* Floating Elements */}
      <View style={styles.floatingElement1}>
        <Icon name="star" size={24} color="#3F51B550" />
      </View>
      <View style={styles.floatingElement2}>
        <Icon name="heart" size={20} color="#FF6B6B50" />
      </View>
      <View style={styles.floatingElement3}>
        <Icon name="circle" size={16} color="#4ECDC450" />
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  animatedIconContainer: {
    marginBottom: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#3F51B5',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  previewCard: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  previewContent: {
    padding: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  timelineCard: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  timelineContent: {
    padding: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  timelineMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineMarkerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timelineText: {
    flex: 1,
  },
  timelinePeriod: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  timelineDesc: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: '#3F51B5',
    paddingVertical: 6,
    marginVertical: 12,
  },
  ctaButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  newsletterCard: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#F9F5FF',
    elevation: 2,
    marginTop: 8,
  },
  newsletterContent: {
    padding: 16,
    alignItems: 'center',
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    marginTop: 8,
  },
  newsletterText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  notifyButton: {
    marginTop: 12,
    borderColor: '#BB8FCE',
  },
  notifyButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 200,
    left: 20,
  },
  floatingElement3: {
    position: 'absolute',
    top: '50%',
    right: 40,
  },
});

export default PlaceholderScreen;
