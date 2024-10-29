import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/authContext'
import CategoryList from './data'

const Home = () => {
    const { currentUser } = useAuth()
    if(currentUser!=null){
        return (
            <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
                <CategoryList />
            </div>
        )
    }
    else{
        return (
            <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
                Welcome to LifeStat, You are not logged in
            </div>
        )
    }
    
}

export default Home