// src/components/AuthHeader.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type Props = {
  showTagline?: boolean; // kept for backward-compat but unused
};

export default function AuthHeader({ showTagline }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require('..//assets/images/1x9.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 170,
    height: 70,
    borderRadius: 18,
  },
});
