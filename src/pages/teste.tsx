import { useState } from "react"


function Teste () {
    const [teste, setTest] = useState("")
    
    console.log(teste)
    setTest("fgffgfg")

    console.log(teste)

    return(

        <h1>Olá, João Paulo!</h1> 
    )
}

export default Teste