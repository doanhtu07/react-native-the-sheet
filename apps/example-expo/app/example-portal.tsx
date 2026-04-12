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
  root: {
    flex: 1,
    gap: 12,
    padding: 16,
    backgroundColor: '#f8f8f2',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  subheader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1a1a2e',
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  planet: {
    fontSize: 15,
    color: '#1a1a2e',
    paddingVertical: 2,
  },
  sourceContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fde8d8',
    borderWidth: 1,
    borderColor: '#f5c4a1',
  },
  hostContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
})
