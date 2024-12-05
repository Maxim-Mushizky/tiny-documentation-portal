// components/content/CreateQA.jsx
import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

export const CreateQA = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('file', file);

            const response = await fetch('http://localhost:3001/api/qa/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to create Q&A');

            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Q&A</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="markdown-file"
                            accept=".md"
                            required
                        />
                        <label
                            htmlFor="markdown-file"
                            className="flex flex-col items-center cursor-pointer"
                        >
                            {file ? (
                                <>
                                    <File className="h-12 w-12 text-blue-500 mb-2" />
                                    <span className="text-sm text-gray-600">{file.name}</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">Click to upload markdown file</span>
                                </>
                            )}
                        </label>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Q&A'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};