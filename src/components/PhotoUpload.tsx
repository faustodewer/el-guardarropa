import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { classifyGarment } from '../lib/replicate'
import './PhotoUpload.css'

interface PhotoUploadProps {
  user: any
  onPhotoAdded: () => void
}

export function PhotoUpload({ user, onPhotoAdded }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    processFile(selected)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const selected = e.dataTransfer.files?.[0]
    if (!selected) return
    processFile(selected)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const processFile = (selected: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    const MIN_DELAY_BETWEEN_UPLOADS = 5000 // 5 seconds

    // Validar tipo
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('Solo se permiten JPEG, PNG, WebP')
      return
    }

    // Validar tamaño
    if (selected.size > MAX_FILE_SIZE) {
      const sizeMB = (selected.size / 1024 / 1024).toFixed(1)
      setError(`Imagen muy grande. Máximo 5MB (actual: ${sizeMB}MB)`)
      return
    }

    // Rate limiting
    const lastUploadTime = parseInt(localStorage.getItem('last_upload_time') || '0')
    if (Date.now() - lastUploadTime < MIN_DELAY_BETWEEN_UPLOADS) {
      const waitSeconds = Math.ceil((MIN_DELAY_BETWEEN_UPLOADS - (Date.now() - lastUploadTime)) / 1000)
      setError(`Espera ${waitSeconds}s antes de subir otra foto`)
      return
    }

    setFile(selected)
    setError('')
    setTags([])

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      localStorage.setItem('last_upload_time', String(Date.now()))
    }
    reader.readAsDataURL(selected)
  }

  const handleAnalyze = async () => {
    if (!preview) return

    setLoading(true)
    setError('')

    try {
      const detectedTags = await classifyGarment(preview)
      setTags(detectedTags)
    } catch (err: any) {
      setError('Error al analizar imagen: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !preview) return

    setLoading(true)
    setError('')

    try {
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('garments')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('garments').getPublicUrl(fileName)

      await supabase.from('garments').insert({
        user_id: user.id,
        name: tags[0] || 'Sin nombre',
        category: tags[1] || 'Otros',
        color: tags[2] || 'No especificado',
        photo_url: urlData.publicUrl,
        ai_tags: tags,
      })

      setFile(null)
      setPreview('')
      setTags([])
      onPhotoAdded()
    } catch (err: any) {
      setError('Error al subir: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="photo-upload">
      <h2>Agregar Prenda</h2>

      {error && <div className="upload-error">{error}</div>}

      {!preview ? (
        <div className="upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={loading}
            id="photo-input"
          />
          <label htmlFor="photo-input" className="upload-label">
            📸 Selecciona una foto o arrastra aquí
          </label>
        </div>
      ) : (
        <div className="upload-preview">
          <img src={preview} alt="Preview" />

          {tags.length === 0 && (
            <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
              {loading ? '⏳ Analizando...' : '🤖 Analizar con IA'}
            </button>
          )}

          {tags.length > 0 && (
            <div className="ai-tags">
              <p className="ai-result">
                ✅ <strong>{tags[0]}</strong> • {tags[1]} • {tags[2]}
              </p>
              <button onClick={handleUpload} disabled={loading} className="upload-btn">
                {loading ? '⏳ Subiendo...' : '✓ Guardar Prenda'}
              </button>
              <button
                onClick={() => {
                  setPreview('')
                  setTags([])
                }}
                disabled={loading}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
