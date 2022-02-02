import { NavigationContext } from "@react-navigation/native";
import React, { Component, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, Alert, Button } from "react-native";
import { GeneralContext } from "../../context/GeneralContext";
import { Storage } from "../../utilities/storage";

const LoginScreen: React.FC = () => {
    
    const context = useContext(GeneralContext);
    const navigation = React.useContext(NavigationContext);
    const [username, setUsername] = useState('')
    const storage = new Storage()
    
    const loginUsername = async () =>  {       
        const { handleUsername }  = context
        if(username.length > 0){
            await handleUsername( username )
            await storage.storeUsername( username )
            navigation?.navigate( 'CryptoList' )
        }else{
            Alert.alert('Wait...', 'Please fill your username')
        }
    }

    return  (<SafeAreaView style={styles.back}>
                <View style={styles.container}>
                    <Text style={styles.label}>Enter your usename:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Enter your Username"
                    />
                    <Button color={'#168B64'} title="Login" onPress={loginUsername} />
                </View>
            </SafeAreaView>);

}

var styles = StyleSheet.create({
    back:{
        backgroundColor: 'white',
        flex:1
    },
    container:{
        padding: 10,
        backgroundColor: 'white'
    },
    label:{
        height: 40,
        padding: 10
    },
    input:{
        backgroundColor: '#EAEAEC',
        height: 40,
        padding: 10,
        borderRadius: 8
    },
    button:{
        backgroundColor: '#168B64'
    }
});

export default LoginScreen;