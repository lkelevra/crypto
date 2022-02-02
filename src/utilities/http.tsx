export default class http {
    GETheaders: any = {};
    POSTheaders: any = {};
    DELETEheaders: any = {};
    TOKENheaders: any = {};
    TOKENheadersPost: any = {};

    constructor() { }

    async get( url: string ) {
        try {
            const headers = this.GETheaders;
            
            const req = await fetch(url, {
                method: "GET",
                headers: headers
            });

            if (!req.ok) throw req
            
            const json = await req.json();
            return json;

        } catch (error: any) {

            console.log("http get method err", error);
            throw new Error(error);
        }
    }

    async buildHeaders() {
        this.GETheaders = {'Content-Type': 'application/json'};
        this.DELETEheaders = {'Content-Type': 'application/json'};
        this.POSTheaders = {
            'Content-Type': 'application/json'
        };
    }
}