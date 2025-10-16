'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Youtube, FileVideo, X, Loader2 } from 'lucide-react';
import styles from './VideoUpload.module.css';

interface VideoUploadProps {
  onUploadComplete?: (projectId: string) => void;
}

export default function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>('file');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      setError('File size must be less than 500MB');
      return;
    }

    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid video file (MP4, MOV, AVI, or WEBM)');
      return;
    }

    setSelectedFile(file);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // Step 1: Get upload URL
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
          size: selectedFile.size
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, projectId } = await response.json();

      // Step 2: Upload file to Vercel Blob
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          // Step 3: Notify backend that upload is complete
          await fetch(`/api/projects/${projectId}/upload-complete`, {
            method: 'POST'
          });

          setUploading(false);
          setUploadProgress(0);
          setSelectedFile(null);
          onUploadComplete?.(projectId);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', selectedFile.type);
      xhr.send(selectedFile);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to import YouTube video');
      }

      const { projectId } = await response.json();
      
      setUploading(false);
      setYoutubeUrl('');
      onUploadComplete?.(projectId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import YouTube video');
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Mode Switcher */}
      <div className={styles.modeSwitcher}>
        <button
          className={`${styles.modeBtn} ${uploadMode === 'file' ? styles.active : ''}`}
          onClick={() => setUploadMode('file')}
          disabled={uploading}
        >
          <Upload size={20} />
          Upload File
        </button>
        <button
          className={`${styles.modeBtn} ${uploadMode === 'youtube' ? styles.active : ''}`}
          onClick={() => setUploadMode('youtube')}
          disabled={uploading}
        >
          <Youtube size={20} />
          YouTube URL
        </button>
      </div>

      {/* File Upload Mode */}
      {uploadMode === 'file' && (
        <div className={styles.uploadArea}>
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ''}`}
            >
              <input {...getInputProps()} />
              <FileVideo size={48} className={styles.icon} />
              <h3>Drag & drop your video here</h3>
              <p>or click to browse</p>
              <span className={styles.formats}>
                Supports MP4, MOV, AVI, WEBM (max 500MB)
              </span>
            </div>
          ) : (
            <div className={styles.fileSelected}>
              <div className={styles.fileInfo}>
                <FileVideo size={24} />
                <div className={styles.fileDetails}>
                  <p className={styles.fileName}>{selectedFile.name}</p>
                  <p className={styles.fileSize}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {!uploading && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => setSelectedFile(null)}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {uploading && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className={styles.progressText}>{uploadProgress}%</span>
                </div>
              )}

              {!uploading && (
                <button
                  className={styles.uploadBtn}
                  onClick={handleFileUpload}
                >
                  Start Upload
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* YouTube URL Mode */}
      {uploadMode === 'youtube' && (
        <div className={styles.youtubeArea}>
          <div className={styles.inputGroup}>
            <Youtube size={24} className={styles.youtubeIcon} />
            <input
              type="text"
              placeholder="Paste YouTube URL here..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={uploading}
              className={styles.youtubeInput}
            />
          </div>
          <button
            className={styles.importBtn}
            onClick={handleYoutubeSubmit}
            disabled={!youtubeUrl.trim() || uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={20} className={styles.spinner} />
                Importing...
              </>
            ) : (
              'Import Video'
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

