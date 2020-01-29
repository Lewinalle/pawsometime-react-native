import React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { vectorIcon } from '../Utils/Icon'

export function SettingsListItem(props) {
    const icon = props.icon.split('.');
    const iconProvider = icon[0].toLowerCase();
    const iconName = icon[1].toLowerCase();
    const iconSize = props.size ? props.size : 28;
    const iconColor = props.color ? props.color : undefined;

    return (
        <View>
            <ListItem
                // leftAvatar={{ source: { uri: l.avatar_url } }}
                leftElement={vectorIcon(iconProvider, iconName, iconSize, iconColor)}
                title={props.title}
                subtitle={props.description}
                onPress={props.onPress}
                bottomDivider
            />
        </View>
    );
}
