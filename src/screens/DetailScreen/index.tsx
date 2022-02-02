import React, {  useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { GeneralContext } from "../../context/GeneralContext";
import CryptoService from "../../services/CryptoService";
import Crypto from "../../interfaces/Crypto";
import { Storage } from "../../utilities/storage";
import NetInfo from "@react-native-community/netinfo";
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import { Path } from "react-native-svg";
import ItemChart from "../../interfaces/ItemChart";
import { format } from 'date-fns'



const getNow = () => {
    return new Date()
}

const MAX_TIME = 5
const MAX_CALLS = 5

const xAxesSvg = {
    fontSize: 12,
    fill: "black",
    rotation: 70,
    originY: 15,
    y: 10
  };
  const yAxesSvg = { fontSize: 12, fill: "black" };
  const verticalContentInset = { left: 10, right: 10, top: 10, bottom: 10 };
  const horizontalContentInset = { left: 10, right: 10 }
  const xAxisHeight = 15;
  const xAxisLabelHeight = 10

export const DetailsScreen: React.FC = () => {
    
    const criptoService = new CryptoService()
    const context = useContext(GeneralContext);
    const [loading, setLoading] = useState(false)
    const [isOffline, setIsOffline] = useState(false)
    const [cryptoId, setCryptoId] = useState<string>()
    const [cryptoName, setCryptoName] = useState('')
    const [yMin, setyMin] = useState(0)
    const [yMax, setyMax] = useState(0)
    const [graphData, setGraphData] = useState<ItemChart[]>([])
    const [ seconds, setSeconds ] = useState(0)
    const [ apiCalls, setApiCalls ] = useState(0)
    const [ stoped, setStoped ] = useState(false)
    const [ startTimer, setStartTimer ] = useState(true)
    const intervalRef = useRef<ReturnType<typeof setInterval>>()

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
          const offline = !(state.isConnected && state.isInternetReachable);
          setIsOffline(offline);
        });
    
        return () => removeNetInfoSubscription();
      }, []);

      useEffect(() => {
        if(!isOffline){

            const interval = setInterval(() => {
                if(startTimer){
                    setSeconds(seconds => seconds + 1);
                }
            }, 1000);
            intervalRef.current = interval;
            return () => clearInterval(interval);
        }else{
            clearCurrentTimeout()
        }
      }, [isOffline, startTimer]);

      useEffect(()=>{
        if(seconds == MAX_TIME && !stoped){
            setSeconds(0);
            getDetail()
        }
      }, [seconds, stoped])

      
      useEffect(()=>{
        if(apiCalls >= MAX_CALLS){
            clearCurrentTimeout()
        }
      }, [apiCalls])


      
    useEffect(()=>{
       const { cryptoSelected } = context
       if(cryptoSelected){
        setCryptoId(cryptoSelected?.id ?? '0');
        setCryptoName(cryptoSelected?.name ?? '')
        try{
            const price = parseFloat(cryptoSelected.price_usd)
            const date = getNow()
            setGraphData(graphData => [...graphData, { value: price, date } ])
        }catch(e){
            Alert.alert('Wait', "Problem parsing number")
        }
       }
    }, [context])

    
    useEffect(()=>{
        getMaxMin()
        console.log(graphData)
    }, [ graphData ])


    const clearCurrentTimeout = () => {
        if(intervalRef.current) clearInterval(intervalRef.current)
        setStoped(true)
    }

    const getMaxMin = () => {
        if(graphData.length > 0){
            const values = graphData.map(item => item.value)
            const max = Math.max(...values) * 1.01
            const min = Math.min(...values) * 0.99
            setyMax(max)
            setyMin(min)
        }
        
    }

    const getDetail = useCallback(( ) => {
        
        if(!isOffline && cryptoId){
            setApiCalls(apiCalls => apiCalls + 1)
            setLoading(true)
            setStartTimer(false)

            criptoService.getDetail(cryptoId).then(response => {

                if(response.result){
                    const { price_usd } = response.data
                    if(price_usd){
                        try{
                            const price = parseFloat(price_usd)
                            const date = getNow()
                            setGraphData(graphData => [...graphData, { value: price, date } ])
                            setStartTimer(true)
                        }catch(e){
                            Alert.alert('Wait', "Problem parsing number")
                        }    
                    }
                }else{
                    Alert.alert('Wait', response.message)
                }
                setIsOffline(false);
                
            }).catch(e =>{
                Alert.alert(e.message)
            }).finally(()=> {
                setLoading(false) 
            })
        }
    }, [isOffline, cryptoId])

    return  (<SafeAreaView style={styles.back}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.username}>Detail for {cryptoName}</Text>
                        <View style={[styles.statusContainer, { backgroundColor: isOffline?'red':'green' }]}>
                            <Text style={styles.status} >{isOffline? 'You are offline': 'You are online'}</Text>
                        </View>
                    </View>  
                    <View style={{ flexDirection: "row", alignItems:'center' }}>
                        <View style={{backgroundColor: '#efefef', borderRadius: 10, padding: 10, marginBottom: 10, flex:1}}>
                            {!stoped && !isOffline && <Text style={styles.calls}>Next call in {MAX_TIME-seconds} seconds</Text>}
                            <Text style={styles.calls}>Api Calls: {apiCalls}</Text>
                        </View>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator animating={loading} color='white' />
                        </View>
                    </View>

                    <View style={{ height: 400, padding: 10, paddingRight: 10, flexDirection: 'row', backgroundColor: '#efefef', borderRadius: 10}}>
                        <YAxis
                            data={graphData}
                            style={{ marginBottom: xAxisHeight + xAxisLabelHeight}}
                            yAccessor={({ item }) => item.value}
                            contentInset={verticalContentInset}

                            svg={yAxesSvg}/>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <LineChart
                                style={{ flex: 1 }}
                                data={graphData}
                                contentInset={verticalContentInset}
                                svg={{ stroke: 'rgb(134, 65, 244)', strokeWidth: 3}}
                                yAccessor={({ item }) => item.value}
                                xAccessor={({ item }) => item.date}
                                yMax={yMax}
                                yMin={yMin}
                            >
                                <Grid/>
                            </LineChart>
                            <XAxis
                                contentInset={horizontalContentInset}
                                numberOfTicks={ graphData.length  }
                                data={graphData}
                                svg={xAxesSvg}
                                xAccessor={({ item }) => item.date}
                                style={{ marginHorizontal: -10, height: xAxisHeight }}
                                formatLabel={(item, index) => format(item, 'HH:mm')}
                            />
                        </View>
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
    calls:{
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 5,
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
    loadingContainer:{
        justifyContent: 'center',
        alignItems:'center',
        alignContent:'center',
        width: 35,
        height: 35,
        backgroundColor: '#333333', 
        borderRadius: 30, 
        marginHorizontal: 10
    }
});

export default DetailsScreen;