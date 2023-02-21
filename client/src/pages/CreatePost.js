import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  },
  
  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]



export default function CreatePost(){
    const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);


  async function createNewPost(ev) {
    ev.preventDefault();
    if (title.trim() === '' || summary.trim() === '' || content.trim() === '' || !files || files.length === 0) {
        alert("Bitte fülle ALLE Felder aus.");
        return;
    }
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
    });
    if (response.ok) {
        setRedirect(true);
        alert("Artikel veröffentlicht.")
    } 
    else if (response.status === 400) {
        alert("Bitte fülle alle Felder aus. Wenn es trotzdem nicht klappt, probiere es später erneut.");
    }
    else {
        // handle other errors
    }
}


  if (redirect) {
    return <Navigate to={'/'} />
  }
    
    return(

        
        <form onSubmit={createNewPost}>
        <input type="title" placeholder={'Titel'} value={title} onChange={ev => setTitle(ev.target.value)} />
        <input type="summary" placeholder={'Beschreibung'} value={summary} onChange={ev => setSummary(ev.target.value)} />
        <input type="file" onChange={ev => setFiles(ev.target.files)} />
        <ReactQuill value={content} modules={modules} formats={formats} onChange={newValue => setContent(newValue)}/>
        <button style={{marginTop:'5px'}}>Artikel veröffentlichen</button>
      </form>
    );

}