'use client'

import { useState } from 'react'
import { Star, Truck, ShieldCheck, Check, Zap, Heart, Dumbbell, Clock, Leaf, Award, TrendingUp, ShoppingCart, ExternalLink, Minus, Plus } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/Toaster'
import { buildAmazonProductUrl } from '@/lib/amazon'

interface Props {
  product: Product
}

export default function ProductDetailClient({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast(`${product.name} added to cart`, 'success')
    const event = new CustomEvent('cart:open')
    window.dispatchEvent(event)
  }
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'benefits' | 'how-to-use'>('description')

  const discount = calculateDiscount(product.price, product.compareAtPrice)

  const benefits = [
    { icon: Dumbbell, text: `${product.proteinPerServing || 26}g Protein per serving for muscle recovery` },
    { icon: Zap, text: 'Sustained energy from complex carbs' },
    { icon: Heart, text: 'Rich in antioxidants from dark chocolate' },
    { icon: Leaf, text: 'No refined sugar, no artificial sweeteners' },
    { icon: Clock, text: 'Perfect for busy mornings or post-workout' },
    { icon: Award, text: 'Packed with almonds, raisins, pumpkin & chia seeds' },
  ]

  const servingSuggestions = [
    'Quick Breakfast: Stir 1/3 cup into hot milk or water',
    'Overnight Oats: Combine 1/3 cup oats with milk, yogurt, and toppings. Refrigerate overnight',
    'Smoothie Boost: Add a scoop to your favorite smoothie for extra protein',
    'Yogurt Topping: Sprinkle over yogurt with fresh fruits',
    'Baking: Use in healthy oat-based treats and energy bars',
  ]

  const storageInstructions = [
    'Store in a cool, dry place away from direct sunlight',
    'Keep the pack sealed after opening',
    'Best before 12 months from manufacturing date',
    'Do not use if packet is damaged or puffed',
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-dark-50">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="h-full w-full object-contain p-4"
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-md bg-red-600 px-2.5 py-1 text-sm font-medium text-white">
                Save {discount}%
              </span>
            )}
            {product.bestSellerRank && (
              <span className="absolute right-4 top-4 rounded-md bg-orange-500 px-2.5 py-1 text-sm font-medium text-white">
                {product.bestSellerRank}
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'h-20 w-20 overflow-hidden rounded-lg border-2',
                    activeImage === i ? 'border-primary-600' : 'border-transparent'
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="mt-3 flex items-center gap-3">
              {renderStars(product.rating)}
              <span className="text-sm font-medium text-dark-700">{product.rating}</span>
              <span className="text-sm text-dark-500">({product.ratingCount?.toLocaleString()} ratings)</span>
            </div>
          )}

          {/* Best Seller & Popularity */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {product.bestSellerRank && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                <TrendingUp className="h-3 w-3" />
                {product.bestSellerRank}
              </span>
            )}
            {product.boughtInPastMonth && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {product.boughtInPastMonth} bought in past month
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-dark-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                -{discount}%
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-dark-500">Inclusive of all taxes</p>

          {product.shortDesc && (
            <p className="mt-4 text-dark-600">{product.shortDesc}</p>
          )}

          {/* Key Features */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {product.flavor && (
              <div className="rounded-lg border border-dark-100 p-3">
                <p className="text-xs text-dark-500">Flavor</p>
                <p className="font-medium">{product.flavor}</p>
              </div>
            )}
            {product.size && (
              <div className="rounded-lg border border-dark-100 p-3">
                <p className="text-xs text-dark-500">Size</p>
                <p className="font-medium">{product.size}</p>
              </div>
            )}
            {product.weight && (
              <div className="rounded-lg border border-dark-100 p-3">
                <p className="text-xs text-dark-500">Weight</p>
                <p className="font-medium">{product.weight}</p>
              </div>
            )}
            <div className="rounded-lg border border-dark-100 p-3">
              <p className="text-xs text-dark-500">Availability</p>
              <p className="flex items-center gap-1 font-medium text-green-600">
                <Check className="h-4 w-4" /> In Stock
              </p>
            </div>
          </div>

          {/* Quantity Selector & Actions */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-dark-700">Quantity:</span>
              <div className="flex items-center rounded-lg border border-dark-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-dark-500 hover:text-dark-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="p-2 text-dark-500 hover:text-dark-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>

            {product.affiliateLink ? (
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex w-full items-center justify-center gap-2 bg-yellow-400 py-3 text-sm font-semibold text-dark-900 hover:bg-yellow-500"
              >
                Buy on Amazon
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : product.amazonAsin ? (
              <a
                href={buildAmazonProductUrl(product.amazonAsin)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex w-full items-center justify-center gap-2 bg-yellow-400 py-3 text-sm font-semibold text-dark-900 hover:bg-yellow-500"
              >
                Buy on Amazon
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          {/* Amazon Info Badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <Truck className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">Free delivery on orders over ₹149</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">Sold by Amazon Retail</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dark-100 p-4 text-center">
              <Check className="h-6 w-6 text-primary-600" />
              <p className="text-xs font-medium">Fulfilled by Amazon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <div className="flex gap-1 overflow-x-auto border-b border-dark-200">
          {(['description', 'nutrition', 'benefits', 'how-to-use'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'whitespace-nowrap px-6 py-3 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-dark-500 hover:text-dark-900'
              )}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Product Description</h2>
                <p className="mt-2 leading-relaxed text-dark-600">{product.description}</p>
              </div>
              {product.ingredients && (
                <div>
                  <h2 className="text-lg font-bold">Ingredients</h2>
                  <p className="mt-2 text-sm leading-relaxed text-dark-500">{product.ingredients}</p>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">About this item</h2>
                <ul className="mt-3 space-y-2 text-sm text-dark-600">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span><strong>Protein-Packed Wellness:</strong> Pintola High Protein Oats Dark Chocolate flavour boast a substantial {product.proteinPerServing || 26}g of protein per 100g of serving, making every spoonful a step towards sustained energy and fullness.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span><strong>Fiber-Rich Vitality:</strong> Rich in dietary fibre, our oats support digestive health, contribute to heart wellness, and play a key role in weight management.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span><strong>Nutrient-Dense Superseeds:</strong> Loaded with chia seeds, pumpkin seeds, almonds, and raisins for an extra boost of vitamins, minerals, and healthy fats.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span><strong>No Refined Sugar:</strong> Enjoy a rich dark chocolate flavor without refined sugar. Naturally sweetened with stevia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span><strong>Gluten Free:</strong> Made with gluten-free rolled oats, suitable for those with gluten sensitivities.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h2 className="text-lg font-bold">Nutrition Facts</h2>
              <p className="mt-1 text-sm text-dark-500">Per serving (50g)</p>
              {product.nutritionFacts ? (
                <div className="mt-4 max-w-md rounded-xl border-2 border-dark-200 p-4">
                  <div className="border-b-2 border-dark-200 pb-2 text-lg font-bold">Nutrition Facts</div>
                  <div className="border-b border-dark-200 py-1 text-xs text-dark-500">Serving Size 50g</div>
                  <div className="space-y-2 pt-2">
                    {Object.entries(product.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between border-b border-dark-100 pb-2">
                        <span className="capitalize text-dark-600">{key}</span>
                        <span className="font-semibold">
                          {String(value)}
                          {key === 'calories' ? ' kcal' : 'g'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-dark-500">Nutrition information not available</p>
              )}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h2 className="text-lg font-bold">Key Benefits</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border border-dark-100 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <benefit.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <p className="text-sm text-dark-600">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'how-to-use' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">How to Use</h2>
                <ul className="mt-3 space-y-3">
                  {servingSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 rounded-lg bg-dark-50 p-3 text-sm text-dark-600">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold">Storage Instructions</h2>
                <ul className="mt-3 space-y-2">
                  {storageInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-dark-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
