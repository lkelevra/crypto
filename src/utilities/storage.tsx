import EncryptedStorage from 'react-native-encrypted-storage';
import { Statics } from "./statics";
import Crypto from '../interfaces/Crypto';
export class Storage {
    statics = new Statics();

    async storeUsername(username: string){
        await EncryptedStorage.setItem("username", username)
    }

    async getUsername(){
        const value = await EncryptedStorage.getItem("username")
        if (value) {
            return value
        }else{
            return ''
        }
    }

    async storeCryptos(cryptos: Crypto[]){
        await EncryptedStorage.setItem("cryptos", JSON.stringify(cryptos))
    }

    async getCryptos(){
        const data = await EncryptedStorage.getItem("cryptos")
        if (data) {
            try{
                const cryptos = JSON.parse(data)
                return cryptos
            }catch(e){
                throw Error('Cant parse data.')
            }
        }else{
            return []
        }
    }


    clean() {
        return new Promise( (resolve, reject) => { 
            EncryptedStorage.clear().then(done => {
                resolve(true);
            }).catch(e =>{
                reject(e)
            });
        });
    }

}