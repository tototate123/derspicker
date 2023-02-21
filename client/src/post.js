import {Link} from "react-router-dom";

export default function Post({_id,title,summary,cover,content,createdAt,author}) {
    return(
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
          <img src={'http://localhost:4000/'+cover} alt="Hier sollte ein Bild sein." className="cover"></img>
          </Link>
          </div>
          <div className="texts">
          <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author" href="https://www.youtube.com/watch?v=WiTxfJhTqao">{author.username}</a>
          <time>{new Date(createdAt).toLocaleDateString()}</time>

        </p>
        <p className="summary">{summary}</p>
        </div>
        </div>
    );

}
//2:23:04