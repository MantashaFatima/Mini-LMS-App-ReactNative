import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
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
import { useCourses } from '../../contexts/CourseContext';
import { Course } from '../../types';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { courses, toggleBookmark } = useCourses();

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const courseId = parseInt(id as string);

    const foundCourse = courses.find(
      (c) => c.id === courseId
    );

    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [id, courses]);

  const handleBookmark = async () => {
    if (course) {
      await toggleBookmark(course.id);

      setCourse((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked: !prev.isBookmarked,
            }
          : null
      );
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);

    Alert.alert(
      'Success ✨',
      'You have been enrolled in this course!'
    );
  };

  const handleViewContent = () => {
    if (course) {
      router.push({
        pathname: '/webview',
        params: {
          courseId: course.id,
          courseTitle: course.title,
        },
      });
    }
  };

  if (!course) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#9CA3AF',
            fontSize: 15,
          }}
        >
          Loading course details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* Decorative Blobs */}
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
          bottom: 100,
          left: -50,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: '#F5F3FF',
          opacity: 0.7,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            position: 'relative',
          }}
        >
          <Image
            source={{ uri: course.image }}
            style={{
              width: '100%',
              height: 260,
              borderRadius: 30,
            }}
            placeholder="placeholder"
            contentFit="cover"
          />

          {/* Overlay */}
          <View
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 30,
              backgroundColor:
                'rgba(0,0,0,0.15)',
            }}
          />

          {/* Back Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              width: 46,
              height: 46,
              borderRadius: 15,
              backgroundColor:
                'rgba(255,255,255,0.92)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          {/* Bookmark */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleBookmark}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 46,
              height: 46,
              borderRadius: 15,
              backgroundColor:
                'rgba(255,255,255,0.92)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={
                course.isBookmarked
                  ? 'bookmark'
                  : 'bookmark-outline'
              }
              size={24}
              color={
                course.isBookmarked
                  ? '#6366F1'
                  : '#374151'
              }
            />
          </TouchableOpacity>

          {/* Category Badge */}
          <View
            style={{
              position: 'absolute',
              bottom: 18,
              left: 18,
              backgroundColor: '#6366F1',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              {course.category}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View
          style={{
            paddingHorizontal: 22,
            paddingTop: 28,
            paddingBottom: 40,
          }}
        >
          {/* Course Title */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#111827',
              lineHeight: 38,
              letterSpacing: -0.8,
            }}
          >
            {course.title}
          </Text>

          <Text
            style={{
              marginTop: 10,
              fontSize: 15,
              color: '#9CA3AF',
              lineHeight: 24,
            }}
          >
            Learn modern skills with premium
            lessons, practical examples, and
            real-world projects.
          </Text>

          {/* Instructor Card */}
          <View
            style={{
              marginTop: 28,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: '#F3F4F6',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.05,
              shadowRadius: 18,
              elevation: 3,
            }}
          >
            <Image
              source={{
                uri: course.instructor?.avatar,
              }}
              style={{
                width: 62,
                height: 62,
                borderRadius: 20,
              }}
              placeholder="placeholder"
              contentFit="cover"
            />

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                  marginBottom: 4,
                }}
              >
                Instructor
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#111827',
                }}
              >
                {course.instructor?.name}
              </Text>
            </View>

            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: '#EEF2FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="school-outline"
                size={26}
                color="#6366F1"
              />
            </View>
          </View>

          {/* Stats Cards */}
          <View
            style={{
              flexDirection: 'row',
              gap: 14,
              marginTop: 22,
            }}
          >
            {/* Price Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: 20,
                borderWidth: 1,
                borderColor: '#F3F4F6',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                  marginBottom: 8,
                }}
              >
                Course Price
              </Text>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: '#6366F1',
                }}
              >
                ${course.price}
              </Text>
            </View>

            {/* Rating Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 22,
                padding: 20,
                borderWidth: 1,
                borderColor: '#F3F4F6',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.04,
                shadowRadius: 16,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                  marginBottom: 8,
                }}
              >
                Course Rating
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="star"
                  size={22}
                  color="#FBBF24"
                />

                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 24,
                    fontWeight: '800',
                    color: '#111827',
                  }}
                >
                  4.8
                </Text>
              </View>
            </View>
          </View>

          {/* Description Card */}
          <View
            style={{
              marginTop: 26,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              borderWidth: 1,
              borderColor: '#F3F4F6',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.04,
              shadowRadius: 16,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#111827',
                marginBottom: 14,
              }}
            >
              About this course
            </Text>

            <Text
              style={{
                color: '#6B7280',
                fontSize: 15,
                lineHeight: 28,
              }}
            >
              {course.description}
            </Text>
          </View>

          {/* Features */}
          <View
            style={{
              marginTop: 22,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
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
              What you'll get
            </Text>

            {[
              'Lifetime course access',
              'Hands-on practical projects',
              'Certificate of completion',
              'Premium support access',
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: '#EEF2FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="#6366F1"
                  />
                </View>

                <Text
                  style={{
                    flex: 1,
                    color: '#4B5563',
                    fontSize: 15,
                    fontWeight: '500',
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View
            style={{
              marginTop: 32,
              gap: 14,
            }}
          >
            {!isEnrolled ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleEnroll}
                style={{
                  backgroundColor: '#6366F1',
                  borderRadius: 18,
                  paddingVertical: 18,
                  alignItems: 'center',
                  shadowColor: '#6366F1',
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 17,
                    fontWeight: '700',
                  }}
                >
                  Enroll Now 🚀
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleViewContent}
                style={{
                  backgroundColor: '#10B981',
                  borderRadius: 18,
                  paddingVertical: 18,
                  alignItems: 'center',
                  shadowColor: '#10B981',
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  elevation: 6,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 17,
                    fontWeight: '700',
                  }}
                >
                  View Course Content 📚
                </Text>
              </TouchableOpacity>
            )}

            {/* Back Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.back()}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text
                style={{
                  color: '#374151',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Back to Courses
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}