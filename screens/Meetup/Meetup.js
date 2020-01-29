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
import { MeetupListCard } from '../../components/MeetupListCard';

export default function Meetup() {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text>
                        Filter goes here!
                    </Text>
                    <View>
                    {meetups.map((item, index) => 
                        <MeetupListCard key={index} meetup={item} />    
                    )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

Meetup.navigationOptions = {
    title: "Meetup"
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

const meetups = [
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    },
    {
        id: 1,
        title: 'Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party Lets Party ',
        description: 'meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk meeting at a partk ',
        location: {
            lat: 40.730610,
            lon: -73.935242,
        },
        host: {
            id: 1,
            name: 'Lewis',
            description: 'Hi I\'m Lewis',
        },
        pending: [
            {
                id: 2,
                name: 'May',
                description: 'Hi I\'m May',
            }
        ],
        users: [
            {
                id: 3,
                name: 'Lewis Two',
                description: 'Hi I\'m Lewis Two',
            }
        ]
    }
];