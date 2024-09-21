import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react"; 
import { CartItem } from "@/types/cartType";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      {orders.map((order, index) => {
        // Convert the order date to a readable format
        const orderDate = new Date(order.createdAt).toLocaleString(); // Replace `createdAt` with the actual date field

        return (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center mb-4">
              Order Status:{" "}
              <span className="text-[#FF5A5A]">{order.status.toUpperCase()}</span>
            </h1>

            {/* Display the order date and time */}
            <p className="text-gray-600 dark:text-gray-200 text-center mb-2">
              Order Placed on: <span className="font-semibold">{orderDate}</span>
            </p>

            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Order Summary
            </h2>

            {order.cartItems.map((item) => {
              const cartItem: CartItem = {
                _id: item.menuId, // Assuming menuId is the same as _id
                name: item.name,
                description: "", // Add a default or derived description
                price: Number(item.price), // Ensure price is a number
                image: item.image,
                quantity: Number(item.quantity),
              }; // Type assertion
              return (
                <div key={cartItem._id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img src={cartItem.image} alt={cartItem.name} className="w-14 h-14 rounded-md object-cover" />
                      <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">{cartItem.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800 dark:text-gray-200 flex items-center">
                        <IndianRupee />
                        <span className="text-lg font-medium">{cartItem.price * cartItem.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              );
            })}
          </div>
        );
      })}
      
      <Link to="/cart">
        <Button className="bg-green-600 w-full py-3 rounded-md shadow-lg">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default Success;
