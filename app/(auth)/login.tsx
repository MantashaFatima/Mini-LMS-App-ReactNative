import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Floating label input component
function FloatingInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  icon: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelTop = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 4],
  });
  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 11],
  });
  const labelColor = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9CA3AF', isFocused ? '#6366F1' : '#6B7280'],
  });

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          borderWidth: isFocused ? 2 : 1.5,
          borderColor: error
            ? '#EF4444'
            : isFocused
            ? '#6366F1'
            : '#E5E7EB',
          borderRadius: 14,
          backgroundColor: isFocused ? '#FAFAFA' : '#F9FAFB',
          paddingHorizontal: 16,
          paddingTop: 22,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={{
              position: 'absolute',
              top: labelTop,
              fontSize: labelFontSize,
              color: error ? '#EF4444' : labelColor,
              fontWeight: '500',
            }}
          >
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize || 'none'}
            style={{
              fontSize: 16,
              color: '#111827',
              paddingTop: 8,
              fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
            }}
            selectionColor="#6366F1"
          />
        </View>
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4 }}
          >
            <Text style={{ fontSize: 18 }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: '#EF4444',
            fontSize: 12,
            marginTop: 5,
            marginLeft: 4,
            fontWeight: '500',
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (_err) {
      // Error already handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Decorative top blob */}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 28,
          }}
        >
          {/* Logo + Brand */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            {/* Icon mark */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: '#6366F1',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              <Text style={{ fontSize: 32 }}>📚</Text>
            </View>

            <Text
              style={{
                fontSize: 30,
                fontWeight: '800',
                color: '#111827',
                letterSpacing: -0.8,
                fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
              }}
            >
              LearnSphere
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#9CA3AF',
                marginTop: 6,
                fontWeight: '400',
                letterSpacing: 0.2,
              }}
            >
              Welcome back! 👋
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              elevation: 6,
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#111827',
                marginBottom: 4,
                letterSpacing: -0.4,
              }}
            >
              Sign In
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#9CA3AF',
                marginBottom: 28,
              }}
            >
              Enter your credentials to continue
            </Text>

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Email Address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="✉️"
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  secureTextEntry
                  icon="🔑"
                />
              )}
            />

            {/* Forgot password */}
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginTop: -8, marginBottom: 28 }}
            >
              <Text
                style={{
                  color: '#6366F1',
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={isLoading}
                activeOpacity={1}
                style={{
                  backgroundColor: isLoading ? '#A5B4FC' : '#6366F1',
                  borderRadius: 14,
                  paddingVertical: 16,
                  alignItems: 'center',
                  shadowColor: '#6366F1',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: isLoading ? 0.1 : 0.4,
                  shadowRadius: 12,
                  elevation: isLoading ? 0 : 6,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: 16,
                    letterSpacing: 0.3,
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#F3F4F6' }} />
              <Text
                style={{
                  marginHorizontal: 12,
                  color: '#D1D5DB',
                  fontSize: 13,
                  fontWeight: '500',
                }}
              >
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#F3F4F6' }} />
            </View>

            {/* Social login row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['🍎  Apple', '🌐  Google'].map((label) => (
                <TouchableOpacity
                  key={label}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingVertical: 13,
                    backgroundColor: '#FAFAFA',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#374151' }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Register Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 32,
            }}
          >
            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register">
              <Text
                style={{
                  color: '#6366F1',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                Create Account
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
