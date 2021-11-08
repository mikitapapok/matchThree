import React, {useEffect, useState} from 'react';
import blueCandy from './style/images/blue-candy.png'
import greenCandy from './style/images/green-candy.png'
import orangeCandy from './style/images/orange-candy.png'
import purpleCandy from './style/images/purple-candy.png'
import redCandy from './style/images/red-candy.png'
import yellowCandy from './style/images/yellow-candy.png'
import blank from './style/images/blank.png'



const width=8;
const candyColors=[blueCandy,greenCandy,orangeCandy,purpleCandy,redCandy,yellowCandy]

function App() {
    const [currentColorArr,setCurrentColorArr]=useState([])
    const [elementDrag,setElementDrag]=useState(null)
    const [elementReplaced,setElementReplaced]=useState(null)
    const [score,setScore]=useState(0)

    const findFourFromColumn=()=>{

        for(let i=0; i<=39;i++){
            const columnOfFour=[i,i+width,i+width*2,i+width*3]
            const matchesColor=currentColorArr[i]
            const isBlank=currentColorArr[i]===blank

            if(columnOfFour.every(element=>currentColorArr[element]===matchesColor && !isBlank)){
                setScore((prev)=>prev+4)
                columnOfFour.forEach(element=>currentColorArr[element]=blank)
                return true
            }

        }

    }
    const findFourFromRow=()=>{

        for(let i=0; i<64;i++){
            const rowOfFour=[i,i+1,i+2,i+3]
            const matchesColor=currentColorArr[i]
            const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
            const isBlank=currentColorArr[i]===blank
            if(notValid.includes(i))continue
            if(rowOfFour.every(element=>currentColorArr[element]===matchesColor && !isBlank)){
                setScore((prev)=>prev+4)
                rowOfFour.forEach(element=>currentColorArr[element]=blank)
                return true
            }

        }

    }


        const findThreeFromColumn=()=>{

            for(let i=0; i<=47;i++){
                const columnOfThree=[i,i+width,i+width*2]
                const matchesColor=currentColorArr[i]
                const isBlank=currentColorArr[i]===blank
                if(columnOfThree.every(element=>currentColorArr[element]===matchesColor && !isBlank)){
                    setScore((prev)=>prev+3)
                    columnOfThree.forEach(element=>currentColorArr[element]=blank)
                    return true
                }

            }

        }

    const findThreeFromRow=()=>{

        for(let i=0; i<64;i++){
            const rowOfThree=[i,i+1,i+2]
            const matchesColor=currentColorArr[i]
            const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
            const isBlank=currentColorArr[i]===blank
            if(notValid.includes(i))continue
            if(rowOfThree.every(element=>currentColorArr[element]===matchesColor && !isBlank)){
                setScore((prev)=>prev+3)
                rowOfThree.forEach(element=>currentColorArr[element]=blank)
                return true
            }

        }

    }

 const moveDown=()=>{
        for(let i=0;i<=55;i++){
            const firstRow=[0,1,2,3,4,5,6,7]
            const isFirst=firstRow.includes(i)
            if(isFirst && currentColorArr[i]===blank){
                let randomNumber=Math.floor(Math.random()*candyColors.length)
                currentColorArr[i]=candyColors[randomNumber]
            }


            if(currentColorArr[i+width]===blank){
                currentColorArr[i+width]=currentColorArr[i];
                currentColorArr[i]=blank
            }
        }
 }

    const getInitialBoard=()=>{
        const randomColorArray=[]
      for (let i=0; i< width*width;i++){
        const randomColor=candyColors[Math.floor(Math.random()*candyColors.length)]
        randomColorArray.push(randomColor)
      }
      setCurrentColorArr(randomColorArray)
    }

useEffect(()=>{

    getInitialBoard()
},[])

useEffect(()=>{

    const timer=setInterval(()=>{
        findFourFromColumn()
        findFourFromRow()
        findThreeFromColumn()
        findThreeFromRow()
        moveDown()
        setCurrentColorArr([...currentColorArr])
    },100)

    return ()=>clearInterval(timer)

},[findFourFromColumn,findFourFromRow,findThreeFromColumn,findThreeFromRow,moveDown,currentColorArr])
    const dragStart=(e)=>{
           setElementDrag(e.target)
    }
    const dragDrop=(e)=>{
        setElementReplaced(e.target)
    }
    const dragEnd=()=>{

        const currentElementDragId= parseInt(elementDrag.getAttribute('data-id'))
        const currentElementReplacedId= parseInt(elementReplaced.getAttribute('data-id'))

        currentColorArr[currentElementReplacedId]=elementDrag.getAttribute('src')
        currentColorArr[currentElementDragId]=elementReplaced.getAttribute('src')
        const moves=[currentElementDragId-1,currentElementDragId-width,currentElementDragId+1,currentElementDragId+width]
        const move=moves.includes(currentElementReplacedId)

       const isFindFourFromColumn= findFourFromColumn()
        const isFindFourFromRow=findFourFromRow()
         const isFindThreeFromColumn=findThreeFromColumn()
        const isFindThreeFromRow=findThreeFromRow()

        if(currentElementReplacedId && move && (isFindFourFromColumn||isFindFourFromRow||isFindThreeFromColumn||isFindThreeFromRow) ){
            setElementDrag(null)
            setElementReplaced(null)
        }else{
            currentColorArr[currentElementReplacedId]=elementReplaced.getAttribute('src')
            currentColorArr[currentElementDragId]=elementDrag.getAttribute('src')
            setCurrentColorArr([...currentColorArr])
        }

    }

  return (
    <div className="playground">
            <div className="game">
                {currentColorArr.map((candyColor,index)=>{
                   return <img key={index} src={candyColor}
                               alt={candyColor}
                               data-id={index}
                                draggable={true}
                               onDragStart={dragStart}
                               onDragOver={(e)=>e.preventDefault()}
                               onDragEnter={(e)=>e.preventDefault()}
                               onDragLeave={(e)=>e.preventDefault()}
                               onDrop={dragDrop}
                               onDragEnd={dragEnd}
                   />
                })}

            </div>
        <div className='score'> Score is: {score}</div>
    </div>
  );
}

export default App;
