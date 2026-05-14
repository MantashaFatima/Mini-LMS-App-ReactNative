import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = z
  .object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, or underscores only'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function FloatingInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
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

function getPasswordStrength(password: string) {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  return score;
}

const STRENGTH_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1'];
const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];

export default function RegisterScreen() {
  const { register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const strength = getPasswordStrength(passwordValue);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!termsAccepted) return;

    setIsLoading(true);

    try {
      // Convert username to lowercase as API requires it
      const lowercaseUsername = data.username.toLowerCase();
      await register(
        lowercaseUsername,
        data.name,
        data.email,
        data.password
      );

      router.replace('/(tabs)');
    } catch (_err) {
    } finally {
      setIsLoading(false);
    }
  };

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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingVertical: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 38 }}>
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
              }}
            >
              LearnSphere
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: '#9CA3AF',
                marginTop: 6,
              }}
            >
              Create your account ✨
            </Text>
          </View>

          {/* Card */}
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
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#111827',
                marginBottom: 4,
              }}
            >
              Create Account
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: '#9CA3AF',
                marginBottom: 28,
              }}
            >
              Fill in your details to continue
            </Text>

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  error={errors.username?.message}
                />
              )}
            />

            {/* Full Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />

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
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <FloatingInput
                    label="Password"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setPasswordValue(text);
                    }}
                    error={errors.password?.message}
                    secureTextEntry
                  />

                  {passwordValue.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginTop: -10,
                        marginBottom: 18,
                      }}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <View
                          key={i}
                          style={{
                            flex: 1,
                            height: 5,
                            borderRadius: 4,
                            backgroundColor:
                              i < strength
                                ? STRENGTH_COLORS[strength - 1]
                                : '#E5E7EB',
                          }}
                        />
                      ))}

                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          marginLeft: 5,
                          color:
                            STRENGTH_COLORS[strength - 1] || '#9CA3AF',
                        }}
                      >
                        {strength > 0
                          ? STRENGTH_LABELS[strength - 1]
                          : ''}
                      </Text>
                    </View>
                  )}
                </>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <FloatingInput
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                />
              )}
            />

            {/* Terms */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 26,
                marginTop: 4,
              }}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: termsAccepted ? '#6366F1' : '#D1D5DB',
                  backgroundColor: termsAccepted
                    ? '#6366F1'
                    : '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                {termsAccepted && (
                  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                    ✓
                  </Text>
                )}
              </View>

              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: '#6B7280',
                  lineHeight: 20,
                }}
              >
                I agree to the{' '}
                <Text
                  style={{
                    color: '#6366F1',
                    fontWeight: '600',
                  }}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={{
                    color: '#6366F1',
                    fontWeight: '600',
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!termsAccepted || isLoading}
              activeOpacity={0.9}
              style={{
                backgroundColor:
                  !termsAccepted || isLoading
                    ? '#A5B4FC'
                    : '#6366F1',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 6,
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
                {isLoading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#F3F4F6',
                }}
              />

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

              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#F3F4F6',
                }}
              />
            </View>

            {/* Social */}
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
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#374151',
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: 14,
              }}
            >
              Already have an account?{' '}
            </Text>

            <Link href="/(auth)/login">
              <Text
                style={{
                  color: '#6366F1',
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                Sign In
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}