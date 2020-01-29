import React from 'react';
import { 
    AntDesign,
    EvilIcons,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome5Brands,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    SimpleLineIcons,
    Octicons,
    Zocial
 } from '@expo/vector-icons';


export const vectorIcon = (provider, name, size, color)=> {
    switch(provider.toLowerCase()) {
        case 'AntDesign'.toLowerCase():
            return <AntDesign name={name} size={size} color={color ? color : undefined} />
        case 'EvilIcons'.toLowerCase():
            return <EvilIcons name={name} size={size} color={color ? color : undefined} />
        case 'Entypo'.toLowerCase():
            return <Entypo name={name} size={size} color={color ? color : undefined} />
        case 'Feather'.toLowerCase():
            return <Feather name={name} size={size} color={color ? color : undefined} />
        case 'FontAwesome'.toLowerCase():
            return <FontAwesome name={name} size={size} color={color ? color : undefined} />
        case 'FontAwesome5'.toLowerCase():
            return <FontAwesome5 name={name} size={size} color={color ? color : undefined} />
        case 'FontAwesome5Brands'.toLowerCase():
            return <FontAwesome5Brands name={name} size={size} color={color ? color : undefined} />
        case 'Fontisto'.toLowerCase():
            return <Fontisto name={name} size={size} color={color ? color : undefined} />
        case 'Foundation'.toLowerCase():
            return <Foundation name={name} size={size} color={color ? color : undefined} />
        case 'Ionicons'.toLowerCase():
            return <Ionicons name={name} size={size} color={color ? color : undefined} />
        case 'MaterialCommunityIcons'.toLowerCase():
            return <MaterialCommunityIcons name={name} size={size} color={color ? color : undefined} />
        case 'MaterialIcons'.toLowerCase():
            return <MaterialIcons name={name} size={size} color={color ? color : undefined} />
        case 'SimpleLineIcons'.toLowerCase():
            return <SimpleLineIcons name={name} size={size} color={color ? color : undefined} />
        case 'Octicons'.toLowerCase():
            return <Octicons name={name} size={size} color={color ? color : undefined} />
        case 'Zocial'.toLowerCase():
            return <Zocial name={name} size={size} color={color ? color : undefined} />
        default:
            return <MaterialCommunityIcons name={name} size={size} color={color ? color : undefined} />
    }
}