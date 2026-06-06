import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

// Catches render errors anywhere in the tree so a single bad screen
// shows a friendly recovery screen instead of a white/crash screen.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('Render error:', error && error.message, info && info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errBox}>
          <Text style={styles.errOm}>ॐ</Text>
          <Text style={styles.errTitle}>Something went wrong</Text>
          <Text style={styles.errSub}>Please try again.</Text>
          <TouchableOpacity style={styles.errBtn} onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.errBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function SplashLoading() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.splash}>
        <Text style={styles.splashOm}>ॐ</Text>
        <Text style={styles.splashTitle}>KrishnaVerse</Text>
        <ActivityIndicator color="#E8690A" style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === '(auth)';

    if (!user && !inAuth) {
      // Not logged in → go to login
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      // Logged in but stuck on auth screen → go to app
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Root layout MUST always render a navigator (Stack/Slot) — Expo Router requirement.
  // Show splash as an overlay on top while auth is resolving.
  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {/* Splash overlay hides the flash of the wrong screen during auth check */}
      {loading && <SplashLoading />}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AuthProvider>
          <AppProvider>
            <AuthGate />
          </AppProvider>
        </AuthProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#1A1208',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashOm: {
    fontSize: 72,
    color: '#E8690A',
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5E8D0',
    letterSpacing: 1,
    marginTop: 8,
  },
  errBox: {
    flex: 1,
    backgroundColor: '#1A1208',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errOm: { fontSize: 56, color: '#E8690A' },
  errTitle: { fontSize: 20, fontWeight: '700', color: '#F5E8D0', marginTop: 12 },
  errSub: { fontSize: 14, color: '#B9A98C', marginTop: 4 },
  errBtn: {
    marginTop: 20,
    backgroundColor: '#E8690A',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  errBtnText: { color: '#fff', fontWeight: '700' },
});
