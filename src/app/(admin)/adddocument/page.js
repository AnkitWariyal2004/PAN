'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPanOptions, setShowPanOptions] = useState(false);
  const [showNewPanForm, setShowNewPanForm] = useState(false);
  const [showRenewPanForm, setShowRenewPanForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    category: '',
    panOption: '',
    name: '',
    dob: '',
    photo: null,
    fatherName: '',
    signImage: null,
    mobile: '',
    status: '',
    remark: '',
    aadharBack: null,
    aadharFront: null,
    previousPanImage: null,
    createdBy: session?.user?.id || '',
  });

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (name === 'category') {
      setShowPanOptions(value === 'Pan');
      setShowNewPanForm(false);
      setShowRenewPanForm(false);
    }

    if (name === 'panOption') {
      setShowNewPanForm(value === 'New PAN Card');
      setShowRenewPanForm(value === 'PAN Card Renewal');
    }

    if (type === 'file') {
      if (files[0] && files[0].size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [name]: 'File size should be less than 2MB' }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    if(formData.category==="Pan"){
      if(formData.panOption===""){
        setErrors((prev) => ({ ...prev, panOption: 'Please select PAN option'
          }));
          return;
      }
    }


    try {
      const response = await fetch('/api/docupload', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const text = await response.text();
      console.log('Raw Server Response:', text);
      const data = JSON.parse(text);

      if (response.ok) {
        console.log('Document added:', data);
        router.push('/documentlist');
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  return (
    <div className="grid sm:grid-cols-12 gap-4 m-4 overflow-hidden">
      <div className="sm:col-span-9 p-6">
        <h2 className="text-xl font-semibold mb-4 text-start">Add Documents</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
              <option value="">Select Category</option>
              <option value="Pan">Pan</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>
          {showPanOptions && (
            <div>
              <label className="block text-gray-600 mb-1">PAN Card Options</label>
              <select name="panOption" value={formData.panOption} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                <option value="">Select Option</option>
                <option value="New PAN Card">New PAN Card</option>
                <option value="PAN Card Renewal">PAN Card Renewal</option>
              </select>
            </div>
          )}
          {showRenewPanForm && (
            <div>
              <label className="block text-gray-600 mb-1">Previous PAN Image</label>
              <input type="file" name="previousPanImage" accept="image/*" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-gray-600 mb-1">Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-gray-600 mb-1">Father&apos; Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Enter Father's Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Signature Image */}
          <div>
            <label className="block text-gray-600 mb-1">Upload Signature</label>
            <input
              type="file"
              name="signImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-600 mb-1">Mobile Number</label>
            <input
              type="number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Aadhar Back Image</label>
            <input
              type="file"
              name="aadharBack"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Aadhar Front Image</label>
            <input
              type="file"
              name="aadharFront"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>

            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Enter any remarks"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          {Object.keys(errors).map((key) => (
            errors[key] && <p key={key} className="text-red-500 text-sm">{errors[key]}</p>
          ))}
        </form>
      </div>

      {/* Right Side - Actions */}
      <div className="sm:col-span-3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Actions</h2>
        <div className="flex flex-col gap-3">
          <button className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white" onClick={handleSave}>
            Save
          </button>
          <button className="w-full p-2 rounded border-2 border-green-500 bg-transparent hover:bg-green-500 hover:text-white">
            Edit
          </button>
          <button className="w-full p-2 rounded border-2 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white">
            Update
          </button>
          <button className="w-full p-2 rounded border-2 border-red-500 bg-transparent hover:bg-red-500 hover:text-white">
            Delete
          </button>
        </div>
      </div>
    </div>

  )
}

export default Page
