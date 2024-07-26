import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>


      <View style={styles.profileSection}>
        <ImageBackground
          source={{ uri: 'https://cdn.usegalileo.ai/stability/fac9104b-5b8e-46d3-936b-5940a000d660.png' }}
          style={styles.profileImage}
          imageStyle={{ borderRadius: 100 }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Allison Wong</Text>
          <Text style={styles.profileDetails}>24, San Francisco</Text>
          <Text style={styles.profileDetails}>Female</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.planSection}>
        {[
          {
            title: 'How to be more confident in 30 days',
            category: 'Mental health',
            imageUri: 'https://cdn.usegalileo.ai/sdxl10/3fe0cb6c-9177-4bba-b3f8-eb5b7a08b5da.png',
          },
          {
            title: '5 habits that changed my life',
            category: 'Productivity',
            imageUri: 'https://cdn.usegalileo.ai/sdxl10/568d812d-e7b9-4198-9df7-d4c7f82e03b8.png',
          },
          {
            title: 'The most powerful morning routine for success',
            category: 'Productivity',
            imageUri: 'https://cdn.usegalileo.ai/stability/3cafc8ab-ed42-488e-9d03-52b995772398.png',
          },
        ].map((plan, index) => (
          <View key={index} style={styles.planItem}>
            <View style={styles.planInfo}>
              <Text style={styles.planCategory}>Growth Plan</Text>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planCategory}>{plan.category}</Text>
            </View>
            <ImageBackground
              source={{ uri: plan.imageUri }}
              style={styles.planImage}
              imageStyle={{ borderRadius: 10 }}
            />
          </View>
        ))}
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111517',
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 128,
    height: 128,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111517',
  },
  profileDetails: {
    fontSize: 14,
    color: '#647987',
  },
  editButton: {
    backgroundColor: '#f0f3f4',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
    maxWidth: 480,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111517',
  },
  planSection: {
    padding: 16,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planInfo: {
    flex: 2,
  },
  planCategory: {
    fontSize: 14,
    color: '#647987',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111517',
  },
  planImage: {
    flex: 1,
    height: 80,
    marginLeft: 16,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f3f4',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: '#647987',
  },
  footerIconActive: {
    tintColor: '#111517',
  },
  footerText: {
    fontSize: 12,
    color: '#647987',
  },
  footerTextActive: {
    color: '#111517',
  },
});

export default ProfileScreen;
