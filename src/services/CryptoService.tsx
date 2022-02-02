import http from '../utilities/http'
import { Statics } from '../utilities/statics'
import { GeneralContext } from '../context/GeneralContext'

export default class CryptoService {
    static contextType = GeneralContext;
    connection = new http();

    async getDetail(id: string){
        // https://api.coinlore.net/api/ticker/?id=90
        try {

            const url = `${Statics.instance.urlBase}${Statics.instance.urlTiker}?id=${id}`;
            console.log(url)

            await this.connection.buildHeaders()

            const req = await this.connection.get( url)

            if (!req ) throw new Error('Error get detail');

            if(req.length > 0){
                return { data: req[0],message:'Showing result', result: true }
            }else{
                return { data:[], message:'Problem Fetching', result: false }
            }
            
        } catch (error: any) {
            console.log(error)
            console.log('service error', error.message)
            return { result: false, message: error.message, records:[] }
        }
    }

    async getList(start: number=0, limit: number=100) {
        
        try {

            const url = `${Statics.instance.urlBase}${Statics.instance.urlTikers}?start=${start}&limit=${limit}`;

            await this.connection.buildHeaders()

            const req = await this.connection.get( url)

            if (!req ) throw new Error('Error get coins');

            const { data, info }  = req

            if(data){
                return { data,  message:'Showing result', result: true }
            }else{
                return { data:[], message:'Problem Fetching', result: false }
            }
            
        } catch (error: any) {
            console.log(error)
            console.log('service error', error.message)
            return { result: false, message: error.message, records:[] }
        }

    }

}