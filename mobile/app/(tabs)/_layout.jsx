import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🪈" label="Guide" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reflect"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧘" label="My Space" focused={focused} />
          ),
        }}
      />
      {/* Shop is on hold for now. The screen file (shop.jsx) is kept intact;
          href:null removes it from the tab bar without deleting it. To bring
          it back, restore the tabBarIcon and remove the href:null line. */}
      <Tabs.Screen
        name="shop"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🙏" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1208',
    borderTopColor: '#3D2A12',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  labelFocused: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
