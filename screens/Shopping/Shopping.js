import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MonoText } from '../../components/StyledText';

export default function Shopping() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <View>
          <View>
            <MonoText>Shopping Screen</MonoText>
          </View>
          <Text>
            This is Shopping Screen !!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

Shopping.navigationOptions = {
    title: "Shopping"
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
});
