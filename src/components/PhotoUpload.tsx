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

    if (!selected.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen')
      return
    }

    setFile(selected)
    setError('')
    setTags([])

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
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
        <div className="upload-area">
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
