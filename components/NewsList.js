import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { test } from '../../redux/actions/test.actions';
import { Auth } from 'aws-amplify';
import DynamicList from './DynamicList';

const NEWS_STACKSIZE = 3;

const NewsList = (props) => {
    const {items = []} = props;
    const [isMax, setIsMax] = uIeState(false);
    
    const fetchMore = () => {
        console.log('fetching more!');
    }

    const renderer = () => {
        return (
            <View>
                <Text>qweadsasdasdqwe123123213</Text>
            </View>
        );
    }

	return (
		<View>
			<Text>This is NewsList</Text>
            <DynamicList renderer={} items={items} totalItems={items.length} fetchMore={} stackSize={NEWS_STACKSIZE} isMax={isMax} />
		</View>
	);
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ test }) => ({
	text: test.text
});

const mapDispatchToProps = {
	test
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);
