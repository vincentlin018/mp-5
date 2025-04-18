'use client'; // Ensures this component runs on the client side

import React from "react";
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import createNewAlias from '@/lib/createNewAlias'; // Import the server action for creating short URLs

export default function ShortenForm() {
    // State variables for form fields and UI feedback
    const [url, setUrl] = useState('');             // Stores the long URL input
    const [alias, setAlias] = useState('');         // Stores the custom alias input
    const [shortUrl, setShortUrl] = useState('');   // Stores the generated short URL
    const [error, setError] = useState('');         // Stores any error messages to display
    const [copied, setCopied] = useState(false);    // Tracks if the short URL has been copied
    const [baseUrl, setBaseUrl] = useState('');     // Stores the current site base URL

    // On mount, set the base URL from the window location (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    // Handles form submission for shortening the URL
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();           // Prevent default form submission
        setError('');                 // Clear any previous errors
        setShortUrl('');              // Clear any previous short URL
        setCopied(false);             // Reset copied state

        // Frontend validation for required fields
        if (!url || !alias) {
            setError('Both fields are required.');
            return;
        }

        // Call the server action and check for error/data
        const result = await createNewAlias(alias, url, new Date());
        if (result.error) {
            setError(result.error);   // Display backend error message
        } else if (result.data) {
            setShortUrl(`${baseUrl}/${result.data.alias}`); // Show new short URL
        } else {
            setError('Unknown error occurred.');
        }
    }

    // Handles copying the short URL to the clipboard
    const handleCopy = async () => {
        if (shortUrl && typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shortUrl);
                setCopied(true); // Show copied feedback
                setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
            } catch {
                setError('Failed to copy to clipboard.');
            }
        }
    };

    // Render the form and feedback UI
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-blue-300 rounded-2xl shadow-lg p-8 w-4xl mx-auto mt-8 flex flex-col gap-6"
        >
            {/* Header and instructions */}
            <div>
                <h2 className="text-center text-2xl font-semibold mb-1">Shorten a URL</h2>
                <p className="text-center text-black text-sm">
                    Enter a long URL to create a shorter, shareable link
                </p>
            </div>
            <div className="flex flex-col gap-4 mx-auto">
                {/* Long URL input */}
                <TextField
                    label="URL"
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    required
                    fullWidth
                    sx={{ width: 700}}
                    size="small"
                />
                {/* Custom alias input, centered with base URL */}
                <div className="w-full flex justify-center">
                    <div className="flex items-center gap-2 ">
                        <span className="text-black text-base select-none">
                            {baseUrl}/
                        </span>
                        <TextField
                            placeholder="Custom Alias"
                            value={alias}
                            onChange={e => setAlias(e.target.value)}
                            required
                            size="small"
                            sx={{ width: 200 }}
                            slotProps={{
                                input: {
                                    style: { padding: '8px 8px' }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Submit button */}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: '98c1d9',
                    textTransform: 'none',
                    margin: 'auto',
                    width: '75%',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 1.2,
                    '&:hover': { backgroundColor: 'e0fbfc' },
                }}
            >
                Shorten
            </Button>
            {/* Error message display */}
            {error && (
                <div className="bg-blue-200 border-red-200 text-red-600 px-4 py-2 rounded text-sm text-center">
                    {error}
                </div>
            )}
            {/* Shortened URL display with copy button */}
            {shortUrl && (
                <div className="backgroundColor: '219ebc',  border border-gray-200 rounded px-4 py-3 justify-between">
                    <div className="text-black text-xs mb-1">Your shortened URL:</div>
                    <div className="flex items-center gap-2">
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black font-medium break-all"
                            style={{ backgroundColor: '219ebc', color: 'black' }}
                        >
                            {shortUrl}
                        </a>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="ml-auto px-6 py-2 text-base rounded bg-blue-800 text-blue-300 hover:bg-blue-500 transition"
                        >
                            {copied ? '✓' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
