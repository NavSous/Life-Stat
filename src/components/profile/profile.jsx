import React from 'react'
import { useAuth } from '../../contexts/authContext'

const Profile = () => {
    const { currentUser } = useAuth()
    if (currentUser!=null){
        return (
            <div className='text-2xl font-bold pt-14' style={{marginLeft: '5vw'}}>
                Name: {currentUser.displayName}
                <br/>
                ID: {currentUser.uid}
                <br/>
                Email: {currentUser.uid}
            </div>
        )
    }
    else{
        return(<script>
            window.onload = function() {
                window.location.replace("/")
            };
</script>)
    }
    
}
export default Profile