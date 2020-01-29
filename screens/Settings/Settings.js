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
import { SettingsListItem } from '../../components/SettingsListItem';

const profileSettings = [
    {
        title: 'Profile info',
        description: 'View and update profile info',
        icon: 'AntDesign.profile'
    }
];

const appSettings = [
    {
        title: 'Help',
        description: 'Let us help you',
        icon: 'Ionicons.ios-help-circle-outline',
        to: 'Help',
    },
    {
        title: 'About',
        description: 'View details and description of application',
        icon: 'Feather.info',
        to: 'About',
    }
];

export default function Settings(props) {
    return (
        <View>
            {appSettings.map((item, index) => (
                <SettingsListItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                    onPress={() => props.navigation.navigate(item.to)}
                />
            ))}
        </View>
    );
}

Settings.navigationOptions = {
    title: 'Settings',
};
