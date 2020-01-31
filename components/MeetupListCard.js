import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon';

const MeetupListCard = memo(props => {
    const { meetup, selected, handleCardSelect, scrollToCard } = props;
    const cardRef = useRef(null);

    useEffect(() => {
        if (selected) {
            cardRef.current.measure((x, y, width, height, pageX, pageY) => {
                scrollToCard(pageY);
            });
        }
    }, [selected])

    return (
        <TouchableOpacity 
            ref={cardRef}
            onPress={e => {
                cardRef.current.measure((x, y, width, height, pageX, pageY) => {
                    handleCardSelect(meetup, pageY);
                });
            }}
        >
            <Card containerStyle={[style.cardStyle, selected && style.cardSelected]}>
                <View 
                    style={style.itemStyle}
                >
                    <Text numberOfLines={1} style={style.title}>{meetup.title}</Text>
                    <Text numberOfLines={1} style={style.description}>{meetup.description}</Text>
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
        </TouchableOpacity>
    );
});

export default MeetupListCard;

const style = StyleSheet.create({
    cardStyle: {
        paddingVertical: 6,
        paddingHorizontal: 9,
        marginVertical: 6
    },
    cardSelected: {
        backgroundColor: '#EEEEEE'
    },
    itemStyle: {
    },
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 18,
        marginBottom: 4,
    },
    description: {
        marginBottom: 4,
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