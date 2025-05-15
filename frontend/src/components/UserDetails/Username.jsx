const Username = (props) => {
    if (!props.user) return null;
    return <h3>{props.user.Username}</h3>;
    
};

export default Username;