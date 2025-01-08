import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function ProfileInformation() {
  const [formData, setFormData] = useState({
    firstName: "anshul",
    lastName: "makhija",
    gender: "male",
    email: "anshul@anshul.",
    mobile: "8189298999",
  });


  console.log("form Data: ", formData);
  
  const [editDetails, setEditDetails] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data: ", formData);
    setEditDetails(false);
  };


  

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <button
          className="hover:font-bold"
          disabled={editDetails}
          onClick={() => setEditDetails(!editDetails)}
        >
          Edit
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            className="w-full p-2 border rounded-md"
            value={formData.firstName}
            disabled={!editDetails}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border rounded-md"
            value={formData.lastName}
            disabled={!editDetails}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div>
          <p className="mb-2">Your Gender</p>
          <div className="flex space-x-4">
            <Label className="flex items-center">
              <Input
                type="radio"
                name="gender"
                value="male"
                className="mr-2"
                disabled={!editDetails}
                checked={formData.gender === "male"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              Male
            </Label>
            <Label className="flex items-center">
              <Input
                type="radio"
                name="gender"
                value="female"
                className="mr-2"
                disabled={!editDetails}
                checked={formData.gender === "female"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              Female
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-600">Email Address</Label>
            </div>
            <Input
              type="email"
              className="w-full p-2 bg-gray-50 border rounded-md"
              value={formData.email}
              disabled={!editDetails}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-600">Mobile Number</Label>
            </div>
            <Input
              type="tel"
              className="w-full p-2 bg-gray-50 border rounded-md"
              value={formData.mobile}
              disabled={!editDetails}
            />
          </div>
        </div>
        {editDetails && (
          <Button
            type="submit"
            onClick={handleSubmit}
            className=" text-white px-6 py-2 rounded-md shadow-sm my-4"
          >
            Save
          </Button>
        )}
      </form>
    </>
  );
}
