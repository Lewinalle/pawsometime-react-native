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
import { BoardListItem } from '../../components/BoardListItem';
import { ListItem, Card, Divider } from 'react-native-elements';

import { connect } from 'react-redux';

import { test } from '../../redux/actions/test.actions'

const Board = props => {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Text>Redux Testing: {props.text}</Text>
                <View>
                    {posts.map((item, index) => 
                        <BoardListItem 
                            key={index} 
                            post={item} 
                            isFirst={index === 0}
                        />
                    )}
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);

Board.navigationOptions = {
    title: "Board"
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingHorizontal: 8,
    },
});

const posts = [
    {
        id: 1,
        user: {
            id: 1,
            name: 'lewis',
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
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
            description: 'Hi I\'m Lewis',
        },
        title: 'Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 Post 1 ',
        content: 'Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content Post 1 Content ',
        createdAt: '2020-01-20',
        views: 132,
        likes: 10,
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: 'May',
                    description: 'Hi I\'m May',
                },
                content: 'Comment One'
            }
        ]
    },
];
