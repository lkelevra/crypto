import { NavigationContext } from "@react-navigation/native";
import React, { Component, useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, Alert, Button, FlatList } from "react-native";
import { GeneralContext } from "../../context/GeneralContext";
import CryptoService from "../../services/CryptoService";
import Crypto from "../../interfaces/Crypto";
import CryptoItemList from "../../components/CryptoItemList";
import { Storage } from "../../utilities/storage";
import NetInfo from "@react-native-community/netinfo";


const ListScreen: React.FC = () => {
    
    const context = useContext(GeneralContext);
    const navigation = React.useContext(NavigationContext);
    const [searchText, setSearchText] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [cryptos, setCryptos] = useState<Crypto[]>([])
    const [cryptosFiltered, setCryptosFiltered] = useState<Crypto[]>([])
    const [isOffline, setIsOffline] = useState(false)
    const [isFiltering, setIsFiltering] = useState(false)
    const criptoService = new CryptoService()
    const storage = new Storage()
    

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
          const offline = !(state.isConnected && state.isInternetReachable);
          setIsOffline(offline);
        });
      
        storage.getUsername().then(value => {
            setUsername(`${value}`)
        }).catch(e => {
            Alert.alert(`User not set`)
        })

        getData()
      
        return () => removeNetInfoSubscription();
      }, []);


    // GET USERNAME FROM CONTEXT
    // useEffect(()=>{
    //    const { username } = context
    //    setUsername(username)
    // }, [context])

    const getData = useCallback(() => {
        setLoading(true)
        if(isOffline){
            criptoService.getList(0, 50).then(response => {
                setCryptos(response.data)
                storage.storeCryptos(response.data)
                setIsOffline(false);
            }).catch(e =>{
                Alert.alert(e.message)
            }).finally(()=> {
                setLoading(false)
            })
        }else{
            storage.getCryptos().then(data => {
                setCryptos(data)
            }).catch(e =>{
                Alert.alert(e.message)
            }).finally(()=> {
                setLoading(false)
            })
        }
    }, [isOffline])

    const showDetail = (item: Crypto) => {
        const {handleCrypto} =  context
        handleCrypto(item)
        navigation?.navigate('Detail')
    }

    const search = () => {
        try{
            if(searchText.length > 0){
                const percent = parseFloat(searchText)/100
                const filtered = cryptos?.filter( crypto => parseFloat(crypto.percent_change_24h) >= percent)
                setCryptosFiltered(filtered)
                setIsFiltering(true)
            }else{
                setCryptosFiltered([])
                setIsFiltering(false)
            }
        }catch(e){
            Alert.alert("Wait..", 'You can just a number')
        }
    }

    return  (<SafeAreaView style={styles.back}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.username}>Welcome {username}</Text>
                        <View style={[styles.statusContainer, { backgroundColor: isOffline?'red':'green' }]}>
                            <Text style={styles.status} >{isOffline? 'You are offline': 'You are online'}</Text>
                        </View>
                    </View>
                    <View style={styles.searchBar}>
                        <TextInput
                                style={styles.inputSearch}
                                onChangeText={setSearchText}
                                value={searchText}
                                placeholder="Minimum 24-hr % Change"
                                keyboardType='numbers-and-punctuation'
                            />
                        {(searchText.length || isFiltering) >  0 && <View style={styles.buttonSearch}>
                            <Button color={'#FFFFFF'} title="Filter" onPress={search} />
                        </View>}
                    </View>
                    <Text style={styles.count}>{isFiltering? cryptosFiltered.length : cryptos?.length} entries</Text>
                    <View style={{flex:1}}>
                        <FlatList
                                style={styles.table}
                                data={ isFiltering? cryptosFiltered : cryptos }
                                onRefresh={() => getData()}
                                refreshing={ loading }
                                keyExtractor={item => item.id.toString()}
                                renderItem={({item})=> (<CryptoItemList cripto={item} onPress={()=>{ showDetail(item) }}/>)}
                            />
                    </View>
                </View>
            </SafeAreaView>);

}

var styles = StyleSheet.create({
    back:{
        backgroundColor: 'white',
        flex:1
    },
    container:{
        flex:1 , 
        padding: 10,
        backgroundColor: 'white'
    },
    header:{
        flexDirection: 'row',
    },
    username:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        flex:1,
    },
    statusContainer:{
        width: 120,
        borderRadius: 10,
        padding: 3, 
        marginTop: 5,
        marginBottom: 10,
        justifyContent:'center',
    
    },
    status:{
        fontSize: 15,
        textAlign:'center',
        color: '#FFFFFF',        
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    count:{
        fontSize: 12,
        fontWeight: 'bold',
        marginVertical: 10
    },
    label:{
        height: 40,
        padding: 10
    },
    searchBar:{
        backgroundColor: '#EAEAEC',
        padding: 10,
        flexDirection: 'row',
        borderRadius: 10
    },
    inputSearch:{
        backgroundColor: '#FFFFFF',
        flex:1,
        marginRight: 10,
        height: 40,
        padding: 10,
        borderRadius: 8
    },
    buttonSearch:{
        backgroundColor: '#168B64',
        borderRadius: 10,
        width: 80
    },
    table:{
        paddingBottom: 100
    }
});

export default ListScreen;