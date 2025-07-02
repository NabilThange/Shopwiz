"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ExternalLink } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart()
    }
  }

  const formatPrice = (price: number | string) => {
    if (typeof price === "string") {
      return price.startsWith("₹") ? price : `₹${price}`
    }
    return `₹${price.toLocaleString()}`
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-pink-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-black">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/conversation">
                <button className="p-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold uppercase flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Shopping Cart
                </h1>
                <p className="text-sm text-gray-600">Your selected items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold mb-4 uppercase">Your Cart is Empty</h2>
            <p className="text-lg text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/conversation">
                <button className="neubrutalism-button bg-purple-400 hover:bg-purple-500">🤖 CHAT WITH AI</button>
              </Link>
              <Link href="/search">
                <button className="neubrutalism-button bg-blue-400 hover:bg-blue-500">🔍 CLASSIC SEARCH</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/conversation">
                <button className="p-2 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold uppercase flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Shopping Cart ({getTotalItems()})
                </h1>
                <p className="text-sm text-gray-600">Your selected items</p>
              </div>
            </div>

            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-100 border-2 border-red-300 rounded-lg font-bold text-sm hover:bg-red-200 text-red-700"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="neubrutalism-card bg-white p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.productImage || "/placeholder.svg?height=100&width=100&text=No+Image"}
                      alt={item.productName}
                      width={100}
                      height={100}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg line-clamp-2">{item.productName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{item.platform}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-xl">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 border-2 border-black rounded bg-gray-100 hover:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 border-2 border-black rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* View Product Link */}
                    {item.productLink && (
                      <div className="mt-3">
                        <button
                          onClick={() => window.open(item.productLink, "_blank")}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View on {item.platform}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="neubrutalism-card bg-white p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4 uppercase">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items ({getTotalItems()})</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t-2 border-black pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full neubrutalism-button bg-green-400 hover:bg-green-500 text-black font-bold py-3">
                  🛒 PROCEED TO CHECKOUT
                </button>
                <Link href="/conversation">
                  <button className="w-full neubrutalism-button bg-purple-400 hover:bg-purple-500 text-black font-bold py-3">
                    🤖 CONTINUE SHOPPING
                  </button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a demo cart. Items are saved locally and checkout is not functional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
