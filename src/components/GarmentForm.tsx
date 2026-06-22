import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './GarmentForm.css'

interface GarmentFormProps {
  user: any
  onSubmit: () => void
  onCancel: () => void
}

export function GarmentForm({ user, onSubmit, onCancel }: GarmentFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Casual')
  const [color, setColor] = useState('Negro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Casual', 'Formal', 'Deportivo', 'Elegante', 'Otro']
  const colors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Beige', 'Otro']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }

    setLoading(true)
    setError('')

    try {
      await supabase.from('garments').insert({
        user_id: user.id,
        name,
        category,
        color,
        ai_tags: [name, category, color],
      })

      onSubmit()
    } catch (err: any) {
      setError('Error al guardar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="garment-form-overlay">
      <form onSubmit={handleSubmit} className="garment-form">
        <h3>Agregar Prenda Manualmente</h3>

        {error && <div className="form-error">{error}</div>}

        <input
          type="text"
          placeholder="Nombre de la prenda (ej: Blusa de algodón)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={color} onChange={(e) => setColor(e.target.value)} disabled={loading}>
          {colors.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onCancel} disabled={loading} className="cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
