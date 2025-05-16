const Username = (props) => {
    console.log("Username Component props.Username ==v")
    console.log(props.Username)
    if (!props.Username) return null;
    return <h3>{props.Username}</h3>;
    
};

export default Username;