import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  Portal,
  PortalHost,
  PortalProvider,
} from 'react-native-universe-portal'

export default function ExamplePortal() {
  return (
    <PortalProvider>
      <View style={styles.root}>
        <Text style={styles.header}>Example Portal</Text>

        <View style={styles.sourceContainer}>
          <Text style={styles.subheader}>Inner planets</Text>
          <Text style={styles.planet}>Mercury</Text>
          <Text style={styles.planet}>Venus</Text>
          <Text style={styles.planet}>Earth</Text>
          <Text style={styles.planet}>Mars</Text>

          <Portal name="jupiter" hostName="solar-system">
            <Text style={styles.planet}>Jupiter</Text>
          </Portal>
          <Portal name="saturn" hostName="solar-system">
            <Text style={styles.planet}>Saturn</Text>
          </Portal>
          <Portal name="uranus" hostName="solar-system">
            <Text style={styles.planet}>Uranus</Text>
          </Portal>
          <Portal name="neptune" hostName="solar-system">
            <Text style={styles.planet}>Neptune</Text>
          </Portal>
        </View>

        <View style={styles.hostContainer}>
          <Text style={styles.subheader}>Outer planets</Text>
          <PortalHost name="solar-system" debug />
        </View>
      </View>
    </PortalProvider>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  header: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: '500',
  },
  hostContainer: {
    backgroundColor: '#dbeafe',
    borderColor: '#bfdbfe',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  planet: {
    color: '#1a1a2e',
    fontSize: 15,
    paddingVertical: 2,
  },
  root: {
    backgroundColor: '#f8f8f2',
    flex: 1,
    gap: 12,
    padding: 16,
  },
  sourceContainer: {
    backgroundColor: '#fde8d8',
    borderColor: '#f5c4a1',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  subheader: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 6,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
})
