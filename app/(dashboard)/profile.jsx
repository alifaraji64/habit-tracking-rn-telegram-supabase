import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const profile = () => {
  return (
    <View>
      <Text>profile</Text>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({})
export const options = {
    headerRight: () => (
      <Button
        onPress={() => alert('Button pressed!')}
        title="Info"
        color="#000"
      />
    ),
  };