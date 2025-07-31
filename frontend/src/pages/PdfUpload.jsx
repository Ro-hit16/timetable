import React, { useState } from 'react';
import axios from 'axios';

const PdfUpload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/api/pdf/upload', formData);
      alert(res.data.message);
    } catch (err) {
      alert('Error uploading PDF');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button type="submit">Upload PDF</button>
    </form>
  );
};

export default PdfUpload;
