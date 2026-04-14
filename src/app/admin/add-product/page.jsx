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
    rating: '4.5',
    ratingCount: '100',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);

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
      // Append to existing files instead of replacing
      const combined = [...selectedFiles, ...filesArray];
      setSelectedFiles(combined);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    const updatedPreviews = [...previewUrls];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);

    // Adjust primaryIndex
    if (primaryIndex === index) setPrimaryIndex(0);
    else if (primaryIndex > index) setPrimaryIndex(prev => prev - 1);
  };

  // Drag handlers for reordering
  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    const [movedFile] = newFiles.splice(dragIndex, 1);
    const [movedPreview] = newPreviews.splice(dragIndex, 1);
    newFiles.splice(index, 0, movedFile);
    newPreviews.splice(index, 0, movedPreview);

    // Adjust primaryIndex during drag
    let newPrimary = primaryIndex;
    if (primaryIndex === dragIndex) newPrimary = index;
    else if (dragIndex < primaryIndex && index >= primaryIndex) newPrimary = primaryIndex - 1;
    else if (dragIndex > primaryIndex && index <= primaryIndex) newPrimary = primaryIndex + 1;

    setPrimaryIndex(newPrimary);
    setDragIndex(index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleDragEnd = () => setDragIndex(null);

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
      submitData.append('rating', formData.rating);
      submitData.append('ratingCount', formData.ratingCount);
      
      const features = formData.features.split('\n').map(s => s.trim()).filter(Boolean);
      submitData.append('features', JSON.stringify(features));

      const advantages = formData.advantages.split('\n').map(s => s.trim()).filter(Boolean);
      submitData.append('advantages', JSON.stringify(advantages));

      // Reorder so primary image is always first
      const orderedFiles = [
        selectedFiles[primaryIndex],
        ...selectedFiles.filter((_, i) => i !== primaryIndex),
      ];
      orderedFiles.forEach((file) => {
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
          rating: '4.5',
          ratingCount: '100',
        });
        setSelectedFiles([]);
        setPreviewUrls([]);
        setPrimaryIndex(0);
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
        {/* <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-6 font-medium text-sm border border-amber-200">
          ⚠️ Make sure your <strong>IMAGEKIT_PRIVATE_KEY</strong> is set in your <code>.env.local</code> before uploading.
        </div> */}

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

          {/* Rating Section */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Product Rating
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Rating Score (0 – 5)</label>
                <input
                  type="number"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition-all font-bold text-dark"
                  placeholder="e.g. 4.5"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">No. of Ratings</label>
                <input
                  type="number"
                  name="ratingCount"
                  min="0"
                  value={formData.ratingCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition-all font-bold text-dark"
                  placeholder="e.g. 1250"
                />
              </div>
            </div>
            {/* Star Preview */}
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5].map(star => {
                const val = parseFloat(formData.rating) || 0;
                const filled = star <= Math.floor(val);
                const half = !filled && star === Math.ceil(val) && val % 1 >= 0.5;
                return (
                  <svg key={star} className={`w-5 h-5 ${filled ? 'text-yellow-400' : half ? 'text-yellow-300' : 'text-gray-300'} fill-current`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                );
              })}
              <span className="text-sm font-bold text-gray-700 ml-1">{formData.rating}</span>
              <span className="text-xs text-gray-400">({Number(formData.ratingCount).toLocaleString()} ratings)</span>
            </div>
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

          {/* Image Upload Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-700">Upload Product Images *</label>
              {previewUrls.length > 0 && (
                <span className="text-xs text-gray-400 font-medium">{previewUrls.length} image{previewUrls.length > 1 ? 's' : ''} selected</span>
              )}
            </div>

            {/* Drop Zone */}
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
                  {previewUrls.length > 0 ? 'Add more images or' : 'Drag and drop images here or'} <span className="text-gold font-bold">Browse</span>
                </div>
                <div className="text-xs text-gray-400">PNG, JPG up to 5MB each • Click an image to set as primary</div>
              </div>
            </div>

            {/* Instruction badge */}
            {previewUrls.length > 1 && (
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span><strong>Drag</strong> to reorder · <strong>Click</strong> an image to set it as the primary cover</span>
              </div>
            )}

            {/* Image Preview Grid with Drag & Primary Select */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {previewUrls.map((url, idx) => (
                  <div
                    key={url}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setPrimaryIndex(idx)}
                    className={`relative group rounded-xl overflow-hidden aspect-square cursor-grab active:cursor-grabbing transition-all duration-200 select-none
                      ${
                        idx === primaryIndex
                          ? 'ring-2 ring-gold ring-offset-2 shadow-lg scale-105'
                          : 'border border-gray-200 hover:border-gold/50 hover:shadow-md'
                      }
                      ${dragIndex === idx ? 'opacity-50 scale-95' : ''}
                    `}
                  >
                    <img src={url} alt={`preview ${idx}`} className="w-full h-full object-cover pointer-events-none" draggable="false" />

                    {/* Primary Badge */}
                    {idx === primaryIndex ? (
                      <span className="absolute bottom-0 left-0 right-0 bg-gold/90 text-white text-[9px] font-black px-1.5 py-1 uppercase tracking-widest text-center">
                        ★ Primary Cover
                      </span>
                    ) : (
                      <span className="absolute bottom-0 left-0 right-0 bg-dark/60 text-white/80 text-[9px] font-medium px-1.5 py-1 uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to set primary
                      </span>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-md z-10"
                      title="Remove"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Order Number Badge */}
                    <span className="absolute top-1.5 left-1.5 bg-dark/70 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
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
