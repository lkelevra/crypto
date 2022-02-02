import React, { createContext, useState } from "react";
import Crypto from "../interfaces/Crypto";

interface contextInterface {
    username: string,
    cryptoSelected?: Crypto,
    handleUsername:(username: string) => void
    handleCrypto:(value: Crypto) => void
}

export const GeneralContext = createContext<contextInterface>({
    username: '',
    cryptoSelected: undefined,
    handleUsername: (value: string) => { },
    handleCrypto:(value: Crypto) => { }
})

const GeneralContextComponent = (props: any) => {

    const [username, setUsername] = useState('')
    const [cryptoSelected, setCryptoSelected] = useState<Crypto>()

    const handleUsername = (value: string) => {
        setUsername(value)
    }
    
    const handleCrypto = (value: Crypto) => {
        setCryptoSelected(value)
    }

    return (<GeneralContext.Provider value={{ username, handleUsername, cryptoSelected, handleCrypto}}>
                {props.children}
            </GeneralContext.Provider>)
}

export default GeneralContextComponent