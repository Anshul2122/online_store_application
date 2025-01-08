import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [validTill, setValidTill] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to save the coupon
      console.log({
        couponCode,
        validTill,
        discountAmount,
      });

      // Replace this with actual API logic using Axios or Fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Coupon created successfully!");
      setCouponCode("");
      setValidTill("");
      setDiscountAmount("");
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("Failed to create coupon. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-96 h-[400px] border-2 mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit}>
        {/* Coupon Code */}
        <div className="mb-4">
          <label
            htmlFor="couponCode"
            className="block text-sm font-medium text-gray-700"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="couponCode"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter coupon code"
            required
          />
        </div>

        {/* Valid Till */}
        <div className="mb-4">
          <label
            htmlFor="validTill"
            className="block text-sm font-medium text-gray-700"
          >
            Valid Till
          </label>
          <input
            type="date"
            id="validTill"
            value={validTill}
            onChange={(e) => setValidTill(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        {/* Discount Amount */}
        <div className="mb-4">
          <label
            htmlFor="discountAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Amount (₹)
          </label>
          <input
            type="number"
            id="discountAmount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter discount amount"
            min="0"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full p-2  text-white font-medium rounded-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-700"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Coupon"}
        </Button>
      </form>
    </div>
  );
};

export default CreateCoupon;
