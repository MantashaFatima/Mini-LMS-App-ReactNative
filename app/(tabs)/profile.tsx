import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { useCourses } from '../../contexts/CourseContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { courses } = useCourses();

  const [avatarUri, setAvatarUri] = useState(
    user?.avatar?.url ?? user?.avatar?.localPath ?? ''
  );

  useEffect(() => {
    setAvatarUri(
      user?.avatar?.url ?? user?.avatar?.localPath ?? ''
    );
  }, [user]);

  const bookmarkedCoursesList = courses.filter(
    (course) => course.isBookmarked
  );
  const enrolledCoursesCount = courses.length;
  const completedCoursesCount = Math.floor(enrolledCoursesCount * 0.3);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleChangeAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Permission to access gallery is required!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);

      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const stats = [
    {
      label: 'Enrolled',
      value: enrolledCoursesCount,
      color: '#6366F1',
      icon: 'book-outline',
    },
    {
      label: 'Completed',
      value: completedCoursesCount,
      color: '#10B981',
      icon: 'checkmark-circle-outline',
    },
    {
      label: 'Bookmarked',
      value: bookmarkedCoursesList.length,
      color: '#F59E0B',
      icon: 'bookmark-outline',
    },
  ];

  const settings = [
    {
      title: 'Notifications',
      icon: 'notifications-outline',
    },
    {
      title: 'Dark Mode',
      icon: 'moon-outline',
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative blobs */}
      <View
        style={{
          position: 'absolute',
          top: -80,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: '#EEF2FF',
          opacity: 0.8,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#E0E7FF',
          opacity: 0.6,
        }}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: '#F5F3FF',
          opacity: 0.7,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleChangeAvatar}
            style={{
              position: 'relative',
            }}
          >
            <View
              style={{
                padding: 4,
                borderRadius: 999,
                backgroundColor: '#6366F1',
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Image
                source={{
                  uri:
                    avatarUri ||
                    'https://via.placeholder.com/100',
                }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 999,
                  backgroundColor: '#F3F4F6',
                }}
                contentFit="cover"
              />
            </View>

            <View
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                backgroundColor: '#6366F1',
                width: 34,
                height: 34,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#FFFFFF',
              }}
            >
              <Ionicons
                name="camera"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#111827',
              marginTop: 20,
              letterSpacing: -0.7,
            }}
          >
            {user?.name}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: '#9CA3AF',
              marginTop: 4,
            }}
          >
            {user?.email}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.9}
            style={{
              marginTop: 22,
              backgroundColor: '#EF4444',
              paddingHorizontal: 26,
              paddingVertical: 13,
              borderRadius: 14,
              shadowColor: '#EF4444',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 22,
            marginBottom: 22,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#111827',
              marginBottom: 20,
            }}
          >
            Learning Statistics
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {stats.map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 18,
                  paddingVertical: 18,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: `${item.color}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '800',
                    color: item.color,
                  }}
                >
                  {item.value}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: '#6B7280',
                    marginTop: 4,
                    fontWeight: '500',
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bookmarked Courses */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 22,
            marginBottom: 22,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#111827',
              marginBottom: 20,
            }}
          >
            Bookmarked Courses
          </Text>

          {bookmarkedCoursesList.length === 0 ? (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 30,
              }}
            >
              <View
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 22,
                  backgroundColor: '#F9FAFB',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={36}
                  color="#D1D5DB"
                />
              </View>

              <Text
                style={{
                  color: '#9CA3AF',
                  fontSize: 15,
                }}
              >
                No bookmarked courses yet
              </Text>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              {bookmarkedCoursesList.slice(0, 5).map((course) => (
                <TouchableOpacity
                  key={course.id}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 18,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#F3F4F6',
                  }}
                >
                  <Image
                    source={{
                      uri:
                        course.image ||
                        'https://via.placeholder.com/62',
                    }}
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 16,
                      backgroundColor: '#E5E7EB',
                    }}
                    contentFit="cover"
                    onError={() =>
                      console.log(
                        '❌ Bookmarked image failed to load:',
                        course.id,
                        course.image
                      )
                    }
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: 14,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        fontWeight: '700',
                        color: '#111827',
                      }}
                    >
                      {course.title}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 13,
                        color: '#9CA3AF',
                        marginTop: 4,
                      }}
                    >
                      {course.instructor?.name}
                    </Text>

                    <Text
                      style={{
                        color: '#6366F1',
                        fontWeight: '700',
                        marginTop: 8,
                        fontSize: 14,
                      }}
                    >
                      ${course.price}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#D1D5DB"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Settings */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 22,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#111827',
              marginBottom: 18,
            }}
          >
            Settings
          </Text>

          <View style={{ gap: 14 }}>
            {settings.map((item) => (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F9FAFB',
                  padding: 16,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      backgroundColor: '#EEF2FF',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#6366F1"
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: '#111827',
                    }}
                  >
                    {item.title}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#D1D5DB"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}