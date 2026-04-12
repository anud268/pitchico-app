"use client";

import React, { useState } from 'react';

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    hasOffer: true,
    category: '',
    longDescription: '',
    features: '',
    advantages: '',
    showOnFrontPage: true,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);

      // Create preview URLs
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = [...previewUrls];
    // Attempt to free memory
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one image to upload.");
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('originalPrice', formData.originalPrice);
      submitData.append('hasOffer', formData.hasOffer);
      submitData.append('category', formData.category);
      submitData.append('longDescription', formData.longDescription);
      submitData.append('showOnFrontPage', formData.showOnFrontPage);
      
      const features = formData.features.split('\n').map(s => s.trim()).filter(Boolean);
      submitData.append('features', JSON.stringify(features));

      const advantages = formData.advantages.split('\n').map(s => s.trim()).filter(Boolean);
      submitData.append('advantages', JSON.stringify(advantages));

      selectedFiles.forEach((file) => {
        submitData.append('images', file);
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        // Reset form completely
        setFormData({
          name: '',
          price: '',
          originalPrice: '',
          hasOffer: true,
          category: '',
          longDescription: '',
          features: '',
          advantages: '',
          showOnFrontPage: true,
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        window.scrollTo(0, 0);
      } else {
        setErrorMsg(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while adding the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
        <h1 className="text-3xl font-display font-bold text-dark mb-8 border-b pb-4">Add New Product</h1>
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium border border-green-200">
            ✅ Product and images successfully uploaded to the database and ImageKit!
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 font-medium border border-red-200">
            ❌ {errorMsg}
          </div>
        )}

        {/* Warning if Private Key is missing, normally one wouldn't show this entirely in production without check 
            but since you are working on it, it's good to keep in mind */}
        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 font-medium text-sm border border-amber-200">
          ⚠️ Make sure your <strong>IMAGEKIT_PRIVATE_KEY</strong> is set in your <code>.env.local</code> before uploading.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="e.g. Smart Watch" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="e.g. Health & Care" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selling Price (₹) *</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="e.g. 299" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (₹) *</label>
              <input type="number" name="originalPrice" required value={formData.originalPrice} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="e.g. 599" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="hasOffer" checked={formData.hasOffer} onChange={handleChange} className="w-5 h-5 text-gold focus:ring-gold border-gray-300 rounded" />
              <span className="font-semibold text-dark">Has Offer</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showOnFrontPage" checked={formData.showOnFrontPage} onChange={handleChange} className="w-5 h-5 text-gold focus:ring-gold border-gray-300 rounded" />
              <span className="font-semibold text-dark">Show On Front Page</span>
            </label>
          </div>

          <hr className="border-gray-100" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Long Description *</label>
            <textarea name="longDescription" required value={formData.longDescription} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="Write a detailed description..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Features (One per line) *</label>
              <textarea name="features" required value={formData.features} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="Feature 1&#10;Feature 2&#10;Feature 3"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Advantages (One per line) *</label>
              <textarea name="advantages" required value={formData.advantages} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition-all" placeholder="Advantage 1&#10;Advantage 2&#10;Advantage 3"></textarea>
            </div>
          </div>

          {/* Elegant File Upload UI */}
          <div className="mt-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">Upload Product Images *</label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gold transition-colors bg-gray-50 cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <div className="text-gray-600 font-medium tracking-wide">
                  Drag and drop your images here or <span className="text-gold font-bold">Browse</span>
                </div>
                <div className="text-xs text-gray-400">High quality PNG, JPG (Max 5MB per image)</div>
              </div>
            </div>

            {/* Image Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
                    <img src={url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 shadow-md"
                      title="Remove Image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-dark/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Primary Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-dark text-white font-bold tracking-widest uppercase rounded-xl hover:bg-gold transition-all shadow-lg disabled:opacity-70 disabled:cursor-wait mt-8 flex justify-center items-center gap-3">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading to ImageKit...
              </>
            ) : 'Upload Product & Images'}
          </button>
        </form>
      </div>
    </div>
  );
}
