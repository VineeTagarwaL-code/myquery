import React, { useState, useEffect } from 'react'
import Category from '../Category/Category'
import axios from 'axios'

import CatNa from './CatNA/CatNa'
import './AddQuestion.css'
import QuestionAdd from './QPanel/QuestionAdd'
export default function AddQuestion() {
  const [AddCat, setAddCat] = useState(false)
  const [CatAvailable , setIsCatAvailable] = useState(false)
  const [cats , setCats] = useState({})

  const [catAcess , setCatAcess] = useState(false)
  //useeffect to fetch if there is catgory that exists , if yes render () if not render (AddCat)
  useEffect(()=>{
    fetch();
  },[])
  
  const fetch = ()=>{
    try{
     
     return  axios.get("http://localhost:8000/getCategory")
     .then((res)=>{
     
      setIsCatAvailable(true)
      setCatAcess(true)
      setCats(res.data.result)
    
    }).catch((res) => {
  

    })
    }catch(e){}
  }
  return (
    <div className='AddQuestionCont'>
 {/* cat available */}
{
  AddCat ?
  < Category/> : (
  CatAvailable ? <QuestionAdd cats = {cats} setAddCat={setAddCat} catAccess={catAcess}/> : <CatNa setAddCat={setAddCat}/> )

}
 
   
{/*        
     jsx - js and html */}


    </div>
  )
}
