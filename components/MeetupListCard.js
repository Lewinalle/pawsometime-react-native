import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';
import { BoardListItemRenderer } from './BoardListItemRenderer';

export function MeetupListCard(props) {
    const { meetup } = props;

    console.log(meetup);

    return (
        <Card>
            <View style={style.itemStyle}>
                <Text numberOfLines={1} style={style.title}>{meetup.title}</Text>
                <Text numberOfLines={3} style={style.description}>{meetup.description}</Text>
                <View style={style.infoRow}>
                    <Text style={style.hostText}>{meetup.host.name}</Text>

                    <View style={style.usersIcon}>
                        {vectorIcon('MaterialIcons', 'people-outline', 14)}
                    </View>
                    <Text style={style.usersText}>{meetup.users.length}</Text>

                    <View style={style.pendingIcon}>
                        {vectorIcon('MaterialCommunityIcons', 'dots-horizontal-circle-outline', 14)}
                    </View>
                    <Text style={style.pendingText}>{meetup.pending.length}</Text>
                </View>
            </View>
        </Card>
    );
}

const style = StyleSheet.create({
    itemStyle: {
        marginLeft: -2,
        marginTop: -4,
    },
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: -10,
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
    },
    description: {
        marginBottom: 8,
    },
    hostText: {
        marginLeft: 4,
        marginRight: 14,
    },
    usersIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    usersText: {
        marginLeft: 4,
        marginRight: 8,
    },
    pendingIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    pendingText: {
        marginLeft: 3,
    },

});