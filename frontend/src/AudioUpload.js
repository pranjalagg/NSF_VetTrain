import React, { useState } from 'react';
import axios from 'axios';

const AudioUpload = () => {
    const [file, setFile] = useState(null);
    const [transcript, setTranscript] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please upload an audio file first.');
            return;
        }

        const formData = new FormData();
        formData.append('audio', file);

        try {
            console.log('Uploading file...');
            const response = await axios.post('https://df53-35-231-211-52.ngrok-free.app/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setTranscript(response.data.transcription);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('There was an error uploading your file.');
        }
    };

    return (
        <div>
            <h3>Upload response as audio file</h3>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit">Upload and Transcribe</button>
            </form>
            {transcript && (
                <div>
                    <h2>Transcription</h2>
                    <p>{transcript}</p>
                </div>
            )}
        </div>
    );
};

export default AudioUpload;
