'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Product } from '@/types'
import { slugify } from '@/lib/utils'
import { useToast } from '@/components/ui/Toaster'

interface Props {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

export default function ProductFormModal({ product, onClose, onSaved }: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDesc: product?.shortDesc || '',
    price: product?.price?.toString() || '',
    compareAtPrice: product?.compareAtPrice?.toString() || '',
    category: product?.category || 'Whey Protein',
    flavor: product?.flavor || '',
    size: product?.size || '',
    weight: product?.weight || '',
    proteinPerServing: product?.proteinPerServing?.toString() || '',
    servingsPerContainer: product?.servingsPerContainer?.toString() || '',
    ingredients: product?.ingredients || '',
    inventory: product?.inventory?.toString() || '0',
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
    image: product?.images?.[0] || '',
  })

  const categories = [
    'Whey Protein',
    'Casein',
    'Plant Protein',
    'Mass Gainer',
    'Collagen',
    'Bars & Snacks',
    'Bundles',
  ]

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      shortDesc: form.shortDesc,
      price: form.price,
      compareAtPrice: form.compareAtPrice || null,
      images: form.image ? [form.image] : [],
      category: form.category,
      flavor: form.flavor,
      size: form.size,
      weight: form.weight,
      proteinPerServing: form.proteinPerServing,
      servingsPerContainer: form.servingsPerContainer,
      ingredients: form.ingredients,
      inventory: form.inventory,
      featured: form.featured,
      isActive: form.isActive,
    }

    try {
      if (product) {
        const res = await fetch('/api/admin', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: product.id, data: payload }),
        })
        if (!res.ok) throw new Error()
      } else {
        const res = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create-product', data: payload }),
        })
        if (!res.ok) throw new Error()
      }
      onSaved()
    } catch {
      toast('Failed to save product', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'input'
  const labelClass = 'label'

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-dark-50" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Product Name</label>
            <input
              value={form.name}
              onChange={(e) => {
                handleChange('name', e.target.value)
                if (!product) handleChange('slug', slugify(e.target.value))
              }}
              className={inputClass}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Slug</label>
            <input
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description</label>
            <input
              value={form.shortDesc}
              onChange={(e) => handleChange('shortDesc', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={inputClass}
              rows={3}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Compare At Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compareAtPrice}
              onChange={(e) => handleChange('compareAtPrice', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Flavor</label>
            <input
              value={form.flavor}
              onChange={(e) => handleChange('flavor', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Size</label>
            <input
              value={form.size}
              onChange={(e) => handleChange('size', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input
              value={form.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Protein Per Serving (g)</label>
            <input
              type="number"
              value={form.proteinPerServing}
              onChange={(e) => handleChange('proteinPerServing', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Servings Per Container</label>
            <input
              type="number"
              value={form.servingsPerContainer}
              onChange={(e) => handleChange('servingsPerContainer', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Inventory</label>
            <input
              type="number"
              min="0"
              value={form.inventory}
              onChange={(e) => handleChange('inventory', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className={inputClass}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Ingredients</label>
            <textarea
              value={form.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              className={inputClass}
              rows={2}
            />
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="h-4 w-4 rounded border-dark-300 text-primary-600"
            />
            <span className="text-sm">Featured product</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-dark-300 text-primary-600"
            />
            <span className="text-sm">Active (visible in store)</span>
          </label>

          <div className="mt-4 flex gap-3 sm:col-span-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}