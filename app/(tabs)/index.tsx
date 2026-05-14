import { Ionicons } from '@expo/vector-icons';
import { LegendList } from '@legendapp/list';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { OfflineBanner } from '../../components/OfflineBanner';
import { useCourses } from '../../contexts/CourseContext';
import { Course } from '../../types';

function CourseItem({
  course,
  onBookmarkToggle,
}: {
  course: Course;
  onBookmarkToggle: (courseId: number) => void;
}) {
  const [imageError, setImageError] = useState(false);

  console.log('🖼 Course card image source:', course.id, course.image);

  return (
    <Link href={`/course/${course.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.courseCard}
      >
        {/* Course Image */}
        <View style={styles.imageWrapper}>
          {imageError || !course.image ? (
            <View style={styles.courseImageFallback}>
              <Ionicons
                name="image-outline"
                size={36}
                color="#9CA3AF"
              />
              <Text style={styles.courseImageFallbackText}>
                Image unavailable
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: course.image }}
              style={styles.courseImage}
              placeholder="placeholder"
              contentFit="cover"
              onError={(error) => {
                console.log(
                  '❌ Course image failed to load, showing placeholder:',
                  course.id,
                  course.image,
                  error
                );
                setImageError(true);
              }}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bookmarkBtn}
            onPress={() =>
              onBookmarkToggle(course.id)
            }
          >
            <Ionicons
              name={
                course.isBookmarked
                  ? 'bookmark'
                  : 'bookmark-outline'
              }
              size={20}
              color={
                course.isBookmarked
                  ? '#6366F1'
                  : '#6B7280'
              }
            />
          </TouchableOpacity>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {course.category}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.courseContent}>
          <Text
            numberOfLines={2}
            style={styles.courseTitle}
          >
            {course.title}
          </Text>

          <Text
            numberOfLines={2}
            style={styles.courseDescription}
          >
            {course.description}
          </Text>

          {/* Footer */}
          <View style={styles.footerRow}>
            <View style={styles.instructorRow}>
              <View style={styles.avatarCircle}>
                <Ionicons
                  name="person"
                  size={14}
                  color="#FFFFFF"
                />
              </View>

              <Text
                numberOfLines={1}
                style={styles.instructorName}
              >
                {course.instructor?.name}
              </Text>
            </View>

            <Text style={styles.price}>
              ${course.price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function CoursesScreen() {
  const {
    isLoading,
    error,
    refreshCourses,
    toggleBookmark,
    searchCourses,
  } = useCourses();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [refreshing, setRefreshing] =
    useState(false);

  const filteredCourses = useMemo(() => {
    return searchCourses(searchQuery);
  }, [searchQuery, searchCourses]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await refreshCourses();
    } catch (_err) {
      Alert.alert(
        'Error',
        'Failed to refresh courses'
      );
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />

        <View style={styles.errorContainer}>
          <View style={styles.errorIconBox}>
            <Ionicons
              name="cloud-offline-outline"
              size={42}
              color="#EF4444"
            />
          </View>

          <Text style={styles.errorTitle}>
            Something went wrong
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={refreshCourses}
            activeOpacity={0.9}
          >
            <Text style={styles.retryBtnText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <OfflineBanner visible={!!error} />

      {/* Top Background */}
      <View style={styles.topGradient} />
      <View style={styles.topCircle} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallHeading}>
            E-LEARNING
          </Text>

          <Text style={styles.mainHeading}>
            Explore Courses ✨
          </Text>

          <Text style={styles.subHeading}>
            Learn modern skills with premium
            courses & expert instructors
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="book-outline"
            size={26}
            color="#6366F1"
          />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchOuter}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9CA3AF"
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search courses..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />

          {searchQuery ? (
            <TouchableOpacity
              onPress={() =>
                setSearchQuery('')
              }
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {filteredCourses.length}
          </Text>

          <Text style={styles.statLabel}>
            Courses
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            20+
          </Text>

          <Text style={styles.statLabel}>
            Categories
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            4.9
          </Text>

          <Text style={styles.statLabel}>
            Ratings
          </Text>
        </View>
      </View>

      {/* Course List */}
      <LegendList
        data={filteredCourses}
        estimatedItemSize={260}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <CourseItem
            course={item}
            onBookmarkToggle={
              toggleBookmark
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#6366F1"
          />
        }
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons
                name="book-outline"
                size={44}
                color="#9CA3AF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              {isLoading
                ? 'Loading Courses...'
                : 'No Courses Found'}
            </Text>

            <Text style={styles.emptyText}>
              Try another keyword or refresh
              the page
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  topGradient: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: '#E0E7FF',
    opacity: 0.9,
  },

  topCircle: {
    position: 'absolute',
    top: 120,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: '#EEF2FF',
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallHeading: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },

  mainHeading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  subHeading: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  searchOuter: {
    paddingHorizontal: 22,
    marginTop: 24,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 6,
  },

  statCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2FF',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  courseCard: {
    marginHorizontal: 22,
    marginTop: 18,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2FF',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },

  imageWrapper: {
    position: 'relative',
  },

  courseImage: {
    width: '100%',
    height: 220,
  },

  courseImageFallback: {
    width: '100%',
    height: 220,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  courseImageFallbackText: {
    color: '#9CA3AF',
    marginTop: 6,
    fontSize: 13,
  },

  bookmarkBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryBadge: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },

  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  courseContent: {
    padding: 18,
  },

  courseTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 10,
  },

  courseDescription: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  instructorName: {
    color: '#6B7280',
    fontSize: 13,
    flex: 1,
  },

  price: {
    color: '#6366F1',
    fontSize: 22,
    fontWeight: '800',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 90,
  },

  emptyIconBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  errorIconBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  errorTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },

  errorText: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 15,
    marginBottom: 28,
  },

  retryBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 18,
  },

  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});