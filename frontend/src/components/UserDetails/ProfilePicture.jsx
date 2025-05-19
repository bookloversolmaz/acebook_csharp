const ProfilePicture = (props) => {
    // console.log("Username Component props.username ==v")
    // console.log(props.username)
    // if (!props.profilepicture) return null;
    return <img src={`/assets/${props.profilepicture}`}/>;
    
};

export default ProfilePicture;