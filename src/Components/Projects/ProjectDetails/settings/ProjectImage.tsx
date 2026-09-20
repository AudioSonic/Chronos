import { useRef, useState, type ChangeEvent } from 'react'
import type { Project } from '../../projectTypes'

export default function ProjectImage({ project }: { project: Project }) {
  const [image, setImage] = useState(project.image ?? 'default')
  const fileInput = useRef<HTMLInputElement>(null)
  const imageInput = useRef<HTMLInputElement>(null)
  const hasImage = Boolean(image && image !== 'default')

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result)
      setImage(value)
      if (imageInput.current) imageInput.current.value = value
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage('default')
    if (imageInput.current) imageInput.current.value = 'default'
    if (fileInput.current) fileInput.current.value = ''
  }

  return <section className="settings-card">
    <h2>▧ &nbsp; Projektbild</h2>
    <div className="settings-image" style={hasImage ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
    </div>
    <input ref={imageInput} type="hidden" name="image" defaultValue={image} />
    <input ref={fileInput} className="settings-file-input" type="file" accept="image/*" onChange={handleImageChange} />
    <div className="settings-actions"><button type="button" onClick={() => fileInput.current?.click()}>▧ Bild ändern</button><button type="button" onClick={removeImage}>♜ Bild entfernen</button></div>
  </section>
}
