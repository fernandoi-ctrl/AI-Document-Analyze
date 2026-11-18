'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { useTranslations } from 'next-intl'

interface FileUploaderProps {
  files: File[]
  onChange: (files: File[]) => void
}

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB
const MAX_FILES = 10

export default function FileUploader({ files, onChange }: FileUploaderProps) {
  const [errors, setErrors] = useState<string[]>([])
  const t = useTranslations('FileUploader')

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setErrors([])

      const newErrors: string[] = []

      if (rejected.length > 0) {
        rejected.forEach((r) => {
          r.errors.forEach((e) => {
            if (e.code === 'file-too-large') {
              newErrors.push(t('tooLarge', { name: r.file.name }))
            } else if (e.code === 'file-invalid-type') {
              newErrors.push(t('invalidType', { name: r.file.name }))
            }
          })
        })
      }

      const combined = [...files, ...accepted]
      if (combined.length > MAX_FILES) {
        newErrors.push(t('tooMany', { max: MAX_FILES }))
        onChange(combined.slice(0, MAX_FILES))
      } else {
        onChange(combined)
      }

      if (newErrors.length > 0) setErrors(newErrors)
    },
    [files, onChange, t]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxSize: MAX_SIZE,
    maxFiles: MAX_FILES,
  })

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200 select-none
          ${isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          {isDragActive ? (
            <p className="text-lg font-semibold text-blue-600">{t('drop')}</p>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-700">
                {t('drag')}
              </p>
              <p className="text-gray-500">{t('or')}</p>
            </>
          )}

          <div className="flex gap-2 mt-1">
            {['PDF', 'JPG', 'PNG', "TXT", "MD"].map((type) => (
              <span key={type} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {type}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400">{t('limit', { max: MAX_FILES })}</p>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-600">⚠ {err}</p>
          ))}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">
            {files.length === 1 ? t('selectedOne', { count: files.length }) : t('selectedMany', { count: files.length })}
          </p>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon type={file.type} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-3 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                aria-label={t('removeFile')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FileIcon({ type }: { type: string }) {
  const isPDF = type === 'application/pdf'
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isPDF ? 'bg-red-100' : 'bg-blue-100'}`}>
      {isPDF ? (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
