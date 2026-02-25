import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadLecture } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileAudio, FileText, Loader2, CheckCircle, X } from 'lucide-react';

const ACCEPTED_TYPES = [
  'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav',
  'application/pdf',
];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateFile = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Only MP3, WAV, and PDF files are supported');
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError('File too large. Max 100MB');
      return false;
    }
    setError('');
    return true;
  };

  const handleFile = (f: File) => {
    if (validateFile(f)) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [title]);

  const handleUpload = async () => {
    if (!file || !title) { setError('Please select a file and enter a title'); return; }
    setUploading(true);
    setProgress(0);
    try {
      await uploadLecture(file, title, setProgress);
      setProcessing(true);
      // Simulated processing delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch {
      setError('Upload failed');
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-2xl py-8">
        <h1 className="mb-6 text-3xl font-bold">Upload Lecture</h1>

        <Card>
          <CardHeader>
            <CardTitle>Upload Audio or PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {file ? (
                <div className="flex items-center gap-3">
                  {file.type.includes('pdf') ? <FileText className="h-8 w-8 text-primary" /> : <FileAudio className="h-8 w-8 text-primary" />}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setFile(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="mb-1 font-medium">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">MP3, WAV, or PDF (up to 100MB)</p>
                </>
              )}
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".mp3,.wav,.pdf"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Lecture Title</Label>
              <Input id="title" placeholder="e.g., Introduction to Machine Learning" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{processing ? 'Processing...' : 'Uploading...'}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                {processing && (
                  <div className="flex items-center justify-center gap-2 pt-4 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">AI is analyzing your lecture...</span>
                  </div>
                )}
              </div>
            )}

            <Button onClick={handleUpload} disabled={!file || !title || uploading} className="w-full">
              {uploading ? (
                processing ? <><CheckCircle className="mr-2 h-4 w-4" />Processing</> : <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />Upload & Process</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
