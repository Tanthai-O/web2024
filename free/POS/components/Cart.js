import { Button } from "@/components/ui/button";

export default function Cart({ cart, total, removeFromCart }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-sm">No items in cart</p>
      ) : (
        <ul className="mt-2">
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between p-2 border-b">
              {item.name} - ${item.price}
              <Button variant="outline" onClick={() => removeFromCart(index)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-lg font-bold mt-4">Total: ${total}</h2>
      <Button className="mt-2">Checkout</Button>
    </div>
  );
}
