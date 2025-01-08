import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from '@/components/ui/button';

const ManageAddresses = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]:value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form Data: ", formData);
    
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-lb mx-auto rounded-md shadow-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Pincode
            </Label>
            <Input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pincode"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Locality
            </Label>
            <Input
              type="text"
              name="locality"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter locality"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Address (Area and Street)
            </Label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              City/District/Town
            </Label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              State
            </Label>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Landmark (optional)
            </Label>
            <Input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter landmark"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Alternate Phone (optional)
            </Label>
            <Input
              type="text"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter alternate phone"
            />
          </div>
        </div>
        <Button
          type="submit"
          className=" text-white px-6 py-2 rounded-md shadow-sm my-4"
        >
          Save
        </Button>
      </form>
    </div>
  );
}

export default ManageAddresses