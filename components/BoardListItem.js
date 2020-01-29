import React from 'react';
import { View, StyleSheet} from 'react-native';
import { ListItem } from 'react-native-elements';
import { BoardListItemRenderer } from './BoardListItemRenderer';

export function BoardListItem(props) {
    const { post } = props;

    return (
        <View style={style.itemStyle}>
            <ListItem 
                {...props}
                Component={BoardListItemRenderer}
                post={post}
            />
        </View>
    );
}

const style = StyleSheet.create({
    itemStyle: {
        flex: 1,
        paddingHorizontal: 4,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,

    },
    description: {
    },
});