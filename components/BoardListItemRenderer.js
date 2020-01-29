import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { vectorIcon } from '../Utils/Icon'

export function BoardListItemRenderer(props) {
    const { post, isFirst } = props;

    return (
        <TouchableHighlight onPress={() => console.log(post.title + "Clicked!")}>
            <View style={style.post} onPress={() => console.log(post.title + 'Clicked!')}>
                <View style={getItemStyle(isFirst)}>
                    <Text numberOfLines={1} style={style.title}>{post.title}</Text>
                    <Text numberOfLines={2} style={style.description}>{post.content}</Text>
                    <View style={style.infoRow}>
                        <View style={style.createdAtIcon}>
                            {vectorIcon('AntDesign', 'calendar', 14)}
                        </View>
                        <Text style={style.createdAtText}>{post.createdAt}</Text>

                        <View style={style.viewsIcon}>
                            {vectorIcon('Entypo', 'magnifying-glass', 12)}
                        </View>
                        <Text style={style.viewsText}>{post.views}</Text>

                        <View style={style.likesIcon}>
                            {vectorIcon('EvilIcons', 'like', 18)}
                        </View>
                        <Text style={style.likesText}>{post.likes}</Text>
                        
                        <View style={style.commentsIcon}>
                            {vectorIcon('MaterialCommunityIcons', 'comment-multiple-outline', 10)}
                        </View>
                        <Text style={style.commentsText}>{post.comments.length}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const getItemStyle = isFirst => {
    let style = {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderColor: '#C0C5CA',
        borderWidth: 1,
        borderRadius: 4
    };
    if (!isFirst) {
        style.borderTopWidth = 0 
    }
    return style;
};

const style = StyleSheet.create({
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        marginBottom: 5,
    },
    createdAtIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    createdAtText: {
        marginRight: 10, 
        marginLeft: 4,
    },
    viewsIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    viewsText: {
        marginRight: 8, 
        marginLeft: 3,
    },
    likesIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    likesText: {
        marginRight: 12,
    },
    commentsIcon: {
        alignSelf: 'center', 
        marginBottom: -3,
    },
    commentsText: {
        marginRight: 0, 
        marginLeft: 4,
    },
});