import React, { useState } from 'react'

export const PositionContext = React.createContext()

export const PositionContextProvider = props => {
    
    const [positionMap, setPositionMap] = useState({
        name: {
          isDisplaced: false,
          positionOrigin: [],
          positionNew: [],
          translate: {x:0,y:0}
        }
    })

    console.group('Context API')
    console.log(positionMap)
    console.groupEnd()

    return (
        <PositionContext.Provider value={[positionMap, setPositionMap]}>
            {props.children}
        </PositionContext.Provider>
    )
}

