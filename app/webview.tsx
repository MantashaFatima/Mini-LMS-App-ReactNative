import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const { courseTitle } = useLocalSearchParams();

  const courseContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />

      <style>
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
          background:#F9FAFB;
          color:#111827;
          padding:22px;
        }

        .hero{
          background:linear-gradient(135deg,#6366F1,#4F46E5);
          border-radius:30px;
          padding:36px 26px;
          color:white;
          margin-bottom:24px;
          box-shadow:0 12px 30px rgba(99,102,241,0.28);
        }

        .badge{
          display:inline-block;
          background:rgba(255,255,255,0.18);
          padding:8px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:600;
          margin-bottom:18px;
        }

        h1{
          font-size:30px;
          line-height:38px;
          margin-bottom:12px;
          font-weight:800;
        }

        .hero p{
          color:rgba(255,255,255,0.88);
          line-height:24px;
          font-size:15px;
        }

        .card{
          background:white;
          border-radius:24px;
          padding:24px;
          margin-bottom:20px;
          box-shadow:0 4px 20px rgba(0,0,0,0.05);
          border:1px solid #F3F4F6;
        }

        .section-title{
          font-size:22px;
          font-weight:700;
          margin-bottom:18px;
          color:#111827;
        }

        .progress-wrap{
          margin:22px 0;
        }

        .progress-bar{
          width:100%;
          height:12px;
          background:#E5E7EB;
          border-radius:999px;
          overflow:hidden;
        }

        .progress-fill{
          width:25%;
          height:100%;
          background:linear-gradient(90deg,#6366F1,#8B5CF6);
          border-radius:999px;
        }

        .progress-text{
          margin-top:10px;
          color:#6366F1;
          font-weight:700;
          font-size:14px;
        }

        .module{
          background:white;
          border-radius:24px;
          padding:22px;
          margin-bottom:18px;
          border:1px solid #EEF2FF;
          box-shadow:0 4px 14px rgba(0,0,0,0.04);
        }

        .module h3{
          color:#111827;
          font-size:18px;
          margin-bottom:10px;
        }

        .module p{
          color:#6B7280;
          line-height:24px;
          margin-bottom:14px;
          font-size:14px;
        }

        ul{
          padding-left:20px;
        }

        li{
          margin-bottom:10px;
          color:#4B5563;
          line-height:22px;
          font-size:14px;
        }

        .footer{
          margin-top:30px;
          text-align:center;
          color:#6366F1;
          font-weight:700;
          font-size:15px;
        }

        .highlight{
          display:flex;
          gap:12px;
          margin-top:18px;
          flex-wrap:wrap;
        }

        .highlight-box{
          flex:1;
          min-width:120px;
          background:#EEF2FF;
          padding:16px;
          border-radius:18px;
          text-align:center;
        }

        .highlight-number{
          font-size:22px;
          font-weight:800;
          color:#4F46E5;
        }

        .highlight-label{
          margin-top:6px;
          font-size:12px;
          color:#6B7280;
          font-weight:600;
        }
      </style>
    </head>

    <body>

      <div class="hero">
        <div class="badge">
          ✨ LearnSphere Premium Course
        </div>

        <h1>
          ${courseTitle || 'Course Content'}
        </h1>

        <p>
          Master modern concepts with hands-on projects,
          interactive learning, and real-world implementation.
        </p>
      </div>

      <div class="card">

        <div class="section-title">
          Course Overview
        </div>

        <p style="color:#6B7280; line-height:26px; font-size:15px;">
          This course helps you build strong practical knowledge in
          ${courseTitle || 'this subject'} through structured modules,
          assignments, and project-based learning.
        </p>

        <div class="progress-wrap">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>

          <div class="progress-text">
            25% Completed
          </div>
        </div>

        <div class="highlight">
          <div class="highlight-box">
            <div class="highlight-number">12+</div>
            <div class="highlight-label">Lessons</div>
          </div>

          <div class="highlight-box">
            <div class="highlight-number">4</div>
            <div class="highlight-label">Modules</div>
          </div>

          <div class="highlight-box">
            <div class="highlight-number">3h</div>
            <div class="highlight-label">Duration</div>
          </div>
        </div>

      </div>

      <div class="module">
        <h3>📘 Module 1: Introduction</h3>

        <p>
          Learn the fundamentals and build a strong foundation
          before moving to advanced concepts.
        </p>

        <ul>
          <li>Understanding core principles</li>
          <li>Environment setup</li>
          <li>Basic terminology</li>
        </ul>
      </div>

      <div class="module">
        <h3>⚡ Module 2: Core Concepts</h3>

        <p>
          Explore the most important concepts with practical
          implementation examples.
        </p>

        <ul>
          <li>Advanced techniques</li>
          <li>Best practices</li>
          <li>Real-world examples</li>
        </ul>
      </div>

      <div class="module">
        <h3>🔥 Module 3: Advanced Topics</h3>

        <p>
          Improve your skills with optimization,
          debugging, and scalable workflows.
        </p>

        <ul>
          <li>Performance optimization</li>
          <li>Scalable architecture</li>
          <li>Debugging strategies</li>
        </ul>
      </div>

      <div class="module">
        <h3>🚀 Module 4: Final Project</h3>

        <p>
          Build a complete real-world project
          using everything learned in the course.
        </p>

        <ul>
          <li>Project planning</li>
          <li>Implementation</li>
          <li>Deployment</li>
        </ul>
      </div>

      <div class="card">
        <div class="section-title">
          Next Steps
        </div>

        <p style="color:#6B7280; line-height:26px; font-size:15px;">
          Continue learning with quizzes, practical assignments,
          and projects to master the concepts confidently.
        </p>

        <div class="footer">
          Happy Learning 🚀
        </div>
      </div>

    </body>
    </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingVertical: 18,
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#F9FAFB',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#111827"
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            marginLeft: 14,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#111827',
            }}
          >
            {courseTitle || 'Course Content'}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: '#9CA3AF',
              marginTop: 2,
            }}
          >
            Continue your learning journey ✨
          </Text>
        </View>
      </View>

      {/* WebView Card */}
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginBottom: 20,
          backgroundColor: '#FFFFFF',
          borderRadius: 28,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <WebView
          source={{ html: courseContent }}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState

          renderLoading={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
              <ActivityIndicator
                size="large"
                color="#6366F1"
              />

              <Text
                style={{
                  marginTop: 16,
                  color: '#9CA3AF',
                  fontSize: 15,
                }}
              >
                Loading amazing content...
              </Text>
            </View>
          )}

          renderError={(errorDomain, errorCode, errorDesc) => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 30,
                backgroundColor: '#FFFFFF',
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 28,
                  backgroundColor: '#FEF2F2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={42}
                  color="#EF4444"
                />
              </View>

              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: 10,
                }}
              >
                Failed to load
              </Text>

              <Text
                style={{
                  color: '#9CA3AF',
                  textAlign: 'center',
                  lineHeight: 24,
                  fontSize: 15,
                }}
              >
                {errorDesc ||
                  'Please check your internet connection and try again.'}
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  marginTop: 28,
                  backgroundColor: '#6366F1',
                  paddingHorizontal: 28,
                  paddingVertical: 15,
                  borderRadius: 16,
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
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
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          )}

          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      </View>
    </SafeAreaView>
  );
}