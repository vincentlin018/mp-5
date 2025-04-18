'use client';
import React from "react";
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import createNewAlias from '@/lib/createNewAlias';

export default function ShortenForm() {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    // Set baseUrl only on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setShortUrl('');
        setCopied(false);

        if (!url || !alias) {
            setError('Both fields are required.');
            return;
        }

        try {
            const result = await createNewAlias(alias, url, new Date());
            setShortUrl(`${baseUrl}/${result.alias}`);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        }
    }

    const handleCopy = async () => {
        if (shortUrl && typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch {
                setError('Failed to copy to clipboard.');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-blue-300 rounded-2xl shadow-lg p-8 w-4xl mx-auto mt-8 flex flex-col gap-6"
        >
            <div>
                <h2 className="text-center text-2xl font-semibold mb-1">Shorten a URL</h2>
                <p className="text-center text-black text-sm">
                    Enter a long URL to create a shorter, shareable link
                </p>
            </div>
            <div className="flex flex-col gap-4 mx-auto">
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
            {error && (
                <div className="bg-blue-200 border-red-200 text-red-600 px-4 py-2 rounded text-sm text-center">
                    {error}
                </div>
            )}
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
