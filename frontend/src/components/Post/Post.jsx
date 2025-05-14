// components: reusable pieces of React code. returns id and message
// TODO: include datetime
const Post = (props) => {
  return <article key={props.post._id}>{props.post.message}</article>;
  // Include datetime in component
};

export default Post;
