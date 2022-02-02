const VERSION = '0.0.1';
const DEV = true;

export class Statics {
    static instance = new Statics()

    public version = VERSION;
    public urlProd = 'https://api.coinlore.net';
    public urlDev  = 'https://api.coinlore.net';
    public urlBase = DEV ? this.urlDev : this.urlProd;

    // URLS
    public urlTikers = '/api/tickers'
    public urlTiker = '/api/ticker'

}