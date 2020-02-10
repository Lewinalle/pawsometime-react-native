import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BoardListItem } from '../../components/BoardListItem';
import { BoardSearch } from '../../components/BoardSearch';

import { connect } from 'react-redux';

import { test } from '../../redux/actions/test.actions';

const Board = (props) => {
	return (
		<View style={styles.container}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View>
					<BoardSearch />
				</View>
				<View>
					{posts.map((item, index) => <BoardListItem key={index} post={item} isFirst={index === 0} />)}
				</View>
			</ScrollView>
		</View>
	);
};

const mapStateToProps = ({ test }) => ({
	text: test.text
});

const mapDispatchToProps = {
	test
};

Board.navigationOptions = {
	title: 'Board'
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginVertical: 5
	},
	contentContainer: {
		paddingHorizontal: 10
	}
});

const posts = [
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	},
	{
		id: 1,
		user: {
			id: 1,
			name: 'lewis',
			description: "Hi I'm Lewis"
		},
		title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
		content:
			'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
		createdAt: '2020-01-20',
		views: 132,
		likes: 10,
		comments: [
			{
				id: 1,
				user: {
					id: 2,
					name: 'May',
					description: "Hi I'm May"
				},
				content: 'Comment One'
			}
		]
	}
];
