const Username = (props) => {
    console.log("Username Component props.username ==v")
    console.log(props.username)
    if (!props.username) return null;
    return <h3>{props.username}</h3>;
    
};

export default Username;