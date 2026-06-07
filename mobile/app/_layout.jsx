import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

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
      <AuthProvider>
        <AppProvider>
          <AuthGate />
        </AppProvider>
      </AuthProvider>
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
});
