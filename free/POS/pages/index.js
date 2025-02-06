import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";

const products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 200 },
  { id: 3, name: "Product C", price: 150 },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    setTotal(total - newCart[index].price);
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple POS System</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      <Cart cart={cart} total={total} removeFromCart={removeFromCart} />
    </div>
  );
}
