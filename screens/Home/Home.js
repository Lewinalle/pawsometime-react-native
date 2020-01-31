import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import { test } from '../../redux/actions/test.actions'

const Home = props => {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <TouchableHighlight onPress={() => {
                    props.test('testing redux!');
                }}>
                    <View>
                        <Text>
                            Change this text and your app will automatically reload.
                        </Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        </View>
    );
}

const mapStateToProps = ({ test }) => ({
    text: test.text
});

const mapDispatchToProps = {
    test
};

Home.navigationOptions = {
    title: "Home"
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

// function handleHelpPress() {
//   WebBrowser.openBrowserAsync(
//     'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },
});
