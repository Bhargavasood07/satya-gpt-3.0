import React, { useState, useCallback, useRef, memo } from 'react';
import { FileUp, File, X, Send, Loader2 } from 'lucide-react';
import { parseDocument, SUPPORTED_FILE_TYPES } from '../../services/documentParserService';
import { askKavachAi } from '../../services/nemotronChatService';
import { motion } from 'framer-motion';

const FileUploadPanel = memo(() => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [response, setResponse] = useState('');
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsParsing(true);
    setFileContent('');
    try {
      const content = await parseDocument(selectedFile);
      setFileContent(content);
    } catch (err) {
      console.error(err);
      setFileContent('Error parsing document.');
    } finally {
      setIsParsing(false);
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleAsk = useCallback(async () => {
    if (!question.trim() || !fileContent) return;
    setIsAnswering(true);
    setResponse('');
    try {
      const prompt = `Context from document:\n${fileContent.substring(0, 3000)}\n\nQuestion: ${question}`;
      const res = await askKavachAi([{ role: 'user', content: prompt }], 'meta-llama-3');
      setResponse(res?.content || 'No response generated.');
    } catch (err) {
      console.error(err);
      setResponse('Error generating response.');
    } finally {
      setIsAnswering(false);
    }
  }, [question, fileContent]);

  const clearFile = useCallback(() => {
    setFile(null);
    setFileContent('');
    setQuestion('');
    setResponse('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 text-slate-200">
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[#27395C] bg-[#131B2E] hover:border-slate-500'}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className={`w-12 h-12 ${isDragging ? 'text-[var(--accent)] animate-bounce' : 'text-slate-500'}`} />
          <div className="text-center">
            <p className="font-bold">Drop file here or click to browse</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Accepts PDF, DOCX, XLSX, TXT</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFile(e.target.files?.[0])}
            accept={SUPPORTED_FILE_TYPES?.join(',') || '.pdf,.docx,.xlsx,.xls,.csv,.txt'}
            className="hidden" 
          />
        </div>
      ) : (
        <div className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 relative">
          <button onClick={clearFile} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-200 bg-[#0B0F19] rounded-full">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#27395C]">
              <File className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-[var(--text-muted)] font-mono">{formatSize(file.size)}</p>
            </div>
          </div>
          {isParsing && (
            <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-mono">
              <Loader2 className="w-4 h-4 animate-spin" /> Extracting text...
            </div>
          )}
        </div>
      )}

      {fileContent && !isParsing && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this document..."
              className="flex-1 bg-[#0B0F19] border border-[#27395C] rounded-lg px-4 py-2 text-sm focus:border-[var(--accent)] outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || isAnswering}
              className="bg-[var(--accent)] text-slate-950 p-2 rounded-lg disabled:opacity-50"
            >
              {isAnswering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          
          {response && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#131B2E] border border-[#27395C] rounded-xl p-4 shadow-lg text-sm leading-relaxed whitespace-pre-wrap">
              {response}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
});

FileUploadPanel.displayName = 'FileUploadPanel';
export default FileUploadPanel;
