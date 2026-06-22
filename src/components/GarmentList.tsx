import { supabase } from '../lib/supabase'
import './GarmentList.css'

interface GarmentListProps {
  garments: any[]
  onGarmentsChange: () => void
}

export function GarmentList({ garments, onGarmentsChange }: GarmentListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta prenda?')) return

    try {
      await supabase.from('garments').delete().eq('id', id)
      onGarmentsChange()
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  return (
    <div className="garment-grid">
      {garments.map((garment) => (
        <div key={garment.id} className="garment-card">
          {garment.photo_url && <img src={garment.photo_url} alt={garment.name} />}

          <div className="garment-info">
            <h4>{garment.name}</h4>
            <div className="garment-meta">
              <span className="badge">{garment.category}</span>
              <span className="badge color">{garment.color}</span>
            </div>
            <p className="garment-date">{new Date(garment.created_at).toLocaleDateString('es-ES')}</p>
          </div>

          <button onClick={() => handleDelete(garment.id)} className="delete-btn" title="Eliminar">
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}
