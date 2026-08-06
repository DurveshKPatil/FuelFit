'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import ProductFormModal from '@/components/admin/ProductFormModal'
import { useToast } from '@/components/ui/Toaster'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/admin?type=products')
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return
    const res = await fetch(`/api/admin?id=${product.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast('Product deleted', 'success')
      fetchProducts()
    } else {
      toast('Failed to delete product', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-sm text-dark-500">{products.length} products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setModalOpen(true)
          }}
          className="btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-dark-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-dark-300" />
          <p className="mt-3 text-sm text-dark-500">No products yet.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-100 text-left text-xs uppercase tracking-wider text-dark-400">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-dark-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-dark-50">
                        <img
                          src={product.images[0] + '?w=96&h=96&fit=crop'}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-dark-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.inventory > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.inventory}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {product.isActive ? (
                      <span className="badge-green">Active</span>
                    ) : (
                      <span className="badge-red">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setModalOpen(true)
                        }}
                        className="rounded-md p-2 text-dark-500 hover:bg-primary-50 hover:text-primary-600"
                        aria-label="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-md p-2 text-dark-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            fetchProducts()
            toast(editingProduct ? 'Product updated' : 'Product created', 'success')
          }}
        />
      )}
    </div>
  )
}