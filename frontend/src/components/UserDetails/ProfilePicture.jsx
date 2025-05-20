const ProfilePicture = (props) => {
    // console.log("Username Component props.username ==v")
    // console.log(`component props.profilepicture is ${props.profilepicture}`)
    // if (!props.profilepicture) return null;
    return <img src={`/assets/${props.profilepicture}`} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%' }}/>
    
    
};

export default ProfilePicture;