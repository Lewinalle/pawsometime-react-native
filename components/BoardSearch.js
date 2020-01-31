import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar, ButtonGroup, Button } from 'react-native-elements';

export const BoardSearch = props => {
    const [text, setText] = useState('');
    const [selected, setSelected] = useState(0);

    const searchBy = [
        'title',
        'description',
        'user',
    ];

    const handleSearchBySelect = index => {
        setSelected(index);
    };

    const handleSubmit = () => {
        // TODO: implement handleSubmit
        console.log(text, searchBy[selected]);
    }

    useEffect(() => {
        setSelected(0);
        setText('');
    }, []);

    return (
        <View style={{marginBottom: 5}}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={text => {
                    setText(text);
                }}
                value={text}
                containerStyle={{padding: 0, backgroundColor: '#fff', borderRadius: 0, borderTopWidth: 0, borderBottomWidth: 0}}
                inputContainerStyle={{borderRadius: 4, backgroundColor: '#fff', borderWidth: 0.5, borderBottomWidth: 0.5}}
                lightTheme
                round
            />
            <View style={{flex: 1, flexDirection: 'row', padding: 0, margin: 0, width: '100%'}}>
                <ButtonGroup
                    onPress={index => handleSearchBySelect(index)}
                    selectedIndex={selected}
                    buttons={searchBy}
                    containerStyle={{height: 30, minWidth: 250, width: '60%', marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0}}
                    textStyle={{fontSize: 12}}
                    selectedButtonStyle={{backgroundColor: 'grey'}}
                />
                <Button
                    title="Search"
                    type='outline'
                    onPress={handleSubmit}
                    titleStyle={{fontSize: 14}}
                    buttonStyle={{height: 30}}
                    containerStyle={{marginLeft: 'auto', width: '30%'}}
                />
            </View>
        </View>
    );
}

// TODO: Refactor all inline stylings into this
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