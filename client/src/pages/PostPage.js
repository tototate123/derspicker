import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function PostPage() {
  const { id } = useParams()
  const [postInfo, setPostInfo] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:4000/post/${id}`)
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const postInfo = await response.json()
        if (postInfo === null) {
          setError(true)
        } else {
          setPostInfo(postInfo)
        }
      } catch (error) {
        console.error(error)
        setError(true)
      }
    }

    fetchPost()
  }, [id])

  if (error) {
    return <div className="IndexPageError">Wie hast du das geschafft? Hier existiert nichts. Bitte gehe zurück zur Startseite.</div>
  }

  if (!postInfo) {
    return null
  }

  return (
    <div className="post-page"> 
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}` } alt=""/>
      </div>
      <h1>{postInfo.title}</h1>
      <div dangerouslySetInnerHTML={{__html:postInfo.content}} />
    </div>
  )
}
