import React from 'react'
import { useAuth } from '../../../contexts/authContext/index.jsx'
import { doDeleteUser } from '../../../firebase/auth'

const Home = () => {
    
    const { currentUser } = useAuth()
    
    if(currentUser!=null){
        return (
            <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
                <a href="/confirm/final/completed/delete">CLICK TO DELETE ACCOUNT IF YOU ARE SURE</a>
            </div>
           
        )
    }
    else{
        return (
            <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
                Your account has been deleted
            </div>
        )
    }
}


export default Home