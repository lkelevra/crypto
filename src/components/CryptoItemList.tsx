import React  from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Crypto from '../interfaces/Crypto';

type CryptoItemListProps = {
    cripto: Crypto,
    onPress: () => void
}

const parsePrice = (value: string) => {
    let percent = '';
    try{
        percent = (parseFloat(value)*100).toFixed(0)
    }catch(e){
        percent = 'Error parsing'
    }
    return percent;
}


const CryptoItemList = (props: CryptoItemListProps) => {
    const percent = parsePrice(props.cripto.percent_change_24h)

    return (<TouchableOpacity style={styles.container} onPress={props.onPress}>
                <View style={styles.line}>
                    <Text style={styles.labelLeft}>{props.cripto.name}</Text>
                    <Text style={styles.labelRight}>{props.cripto.symbol}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={styles.labelLeft}>USD {props.cripto.price_usd}</Text>
                    <Text style={[styles.labelRight, { color: 'green'}]}>{`${percent}%`}</Text>
                </View>
            </TouchableOpacity>);

};

const styles = StyleSheet.create({
    container:{
        flex:1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ebebeb",
        backgroundColor: 'white',
        marginVertical: 3,
        padding: 10
    },
    line:{
        flexDirection:'row',
        marginTop: 2
    },
    labelLeft:{
        fontSize:15,
        flex:1
    },
    labelRight:{
        fontSize:15,
        flex:1,
        textAlign:'right'
    }
});

export default CryptoItemList;