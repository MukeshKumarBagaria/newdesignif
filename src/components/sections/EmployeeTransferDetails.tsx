import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEventHandler, CSSProperties, DragEventHandler, ReactNode } from 'react';
import { EditableField, EditableLabel, NextButton } from '../form';
import { IconFilePlus } from '../icons';

type Props = { onNext: () => void };

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 20;
const ACCEPT = 'image/jpeg,image/png,application/pdf';
const UPLOAD_MS = 2200;

function isAcceptedFile(file: File) {
  if (ACCEPT.split(',').some((m) => file.type === m.trim())) return true;
  return /\.(jpe?g|png|pdf)$/i.test(file.name);
}

type Attachment = {
  id: string;
  name: string;
  size: number;
  isPdf: boolean;
  objectUrl: string;
  status: 'uploading' | 'complete';
  progress: number;
};

/**
 * Section 02 — Employee Transfer Details
 *  Header  : Figma node 5938:50707
 *  Body    : Figma node 5938:50717
 *
 * Attachments: multiple files (browse with multi-select or repeated add, drag
 * multiple) — each file uploads in parallel; list shows uploading and completed
 * rows in add order.
 */
export function EmployeeTransferDetailsContent({ onNext }: Props) {
  const [transferFrom, setTransferFrom] = useState('Old Office');
  const [transferTo, setTransferTo] = useState('New Office');
  const [relievingDate, setRelievingDate] = useState('');
  const [typeOfTransfer, setTypeOfTransfer] = useState('Inter/Intra district');
  const [orderNo, setOrderNo] = useState('Order No');

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafByIdRef = useRef<Map<string, number>>(new Map());
  const activeUploadById = useRef<Set<string>>(new Set());
  const attachmentsRef = useRef<Attachment[]>([]);
  attachmentsRef.current = attachments;

  const startProgressSimulation = useCallback((id: string) => {
    activeUploadById.current.add(id);
    const start = performance.now();
    const tick = (now: number) => {
      if (!activeUploadById.current.has(id)) return;
      const t = Math.min(1, (now - start) / UPLOAD_MS);
      setAttachments((prev) =>
        prev.map((a) => (a.id === id && a.status === 'uploading' ? { ...a, progress: t } : a))
      );
      if (t < 1) {
        rafByIdRef.current.set(id, requestAnimationFrame(tick));
      } else {
        rafByIdRef.current.delete(id);
        activeUploadById.current.delete(id);
        setAttachments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'complete', progress: 1 } : a))
        );
      }
    };
    rafByIdRef.current.set(id, requestAnimationFrame(tick));
  }, []);

  const queueFiles = useCallback(
    (incoming: File[]) => {
      const valid: File[] = [];
      for (const file of incoming) {
        if (!isAcceptedFile(file)) {
          alert(`"${file.name}" is not a supported type. Use JPEG, PNG, or PDF.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          alert(`"${file.name}" is too large. Maximum size is 10 MB per file.`);
          continue;
        }
        valid.push(file);
      }
      if (!valid.length) return;
      setAttachments((prev) => {
        const room = MAX_FILES - prev.length;
        if (room <= 0) {
          alert(`You can add at most ${MAX_FILES} attachments.`);
          return prev;
        }
        const take = valid.slice(0, room);
        if (valid.length > room) {
          alert(`Only the first ${room} file(s) were added (${MAX_FILES} attachments max).`);
        }
        const additions: Attachment[] = take.map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          isPdf: file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf',
          objectUrl: URL.createObjectURL(file),
          status: 'uploading',
          progress: 0,
        }));
        queueMicrotask(() => additions.forEach((a) => startProgressSimulation(a.id)));
        return [...prev, ...additions];
      });
    },
    [startProgressSimulation]
  );

  const onCancelUpload = useCallback((id: string) => {
    const h = rafByIdRef.current.get(id);
    if (h) cancelAnimationFrame(h);
    rafByIdRef.current.delete(id);
    activeUploadById.current.delete(id);
    setAttachments((prev) => {
      const a = prev.find((x) => x.id === id);
      if (a?.objectUrl) URL.revokeObjectURL(a.objectUrl);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const onDeleteAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const a = prev.find((x) => x.id === id);
      if (a?.objectUrl) URL.revokeObjectURL(a.objectUrl);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const onView = useCallback((id: string) => {
    const a = attachmentsRef.current.find((x) => x.id === id);
    if (a?.objectUrl) window.open(a.objectUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const onPickFile = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    queueFiles(Array.from(fileList));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onBrowse = () => fileInputRef.current?.click();

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onPickFile(e.target.files);
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const { files } = e.dataTransfer;
    if (files?.length) queueFiles(Array.from(files));
  };

  const onDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (e.currentTarget === e.target) setIsDragging(false);
  };

  useEffect(
    () => () => {
      rafByIdRef.current.forEach((h) => cancelAnimationFrame(h));
      rafByIdRef.current.clear();
      activeUploadById.current.clear();
      attachmentsRef.current.forEach((a) => {
        if (a.objectUrl) URL.revokeObjectURL(a.objectUrl);
      });
    },
    []
  );

  const atFileLimit = attachments.length >= MAX_FILES;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-end self-stretch w-full"
      style={{ gap: 32 }}
    >
      <div className="flex flex-col items-start w-full" style={{ gap: 24 }}>
        <div
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px 28px',
          }}
        >
          <FieldGroup width="auto" label="Transfer From" required delay={0}>
            <EditableField
              value={transferFrom}
              onChange={setTransferFrom}
              placeholder="Old Office"
              ariaLabel="Transfer From"
            />
          </FieldGroup>
          <FieldGroup width="auto" label="Transfer To" required delay={0.04}>
            <EditableField
              value={transferTo}
              onChange={setTransferTo}
              placeholder="New Office"
              ariaLabel="Transfer To"
            />
          </FieldGroup>
          <FieldGroup width="auto" label="Relieving Date" required delay={0.08}>
            <EditableField
              value={relievingDate}
              onChange={setRelievingDate}
              placeholder="dd / mm / yyyy"
              ariaLabel="Relieving Date"
            />
          </FieldGroup>

          <FieldGroup width="auto" label="Type of Transfer" required delay={0.12}>
            <EditableField
              value={typeOfTransfer}
              onChange={setTypeOfTransfer}
              placeholder="Inter/Intra district"
              ariaLabel="Type of Transfer"
            />
          </FieldGroup>
          <FieldGroup width="auto" label="Transfer Order Number" required delay={0.16}>
            <EditableField
              value={orderNo}
              onChange={setOrderNo}
              placeholder="Order No"
              ariaLabel="Transfer Order Number"
            />
          </FieldGroup>
        </div>

        <div className="flex items-stretch w-full" style={{ gap: 12, borderRadius: 16 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            tabIndex={-1}
            onChange={onInputChange}
          />

          <DropZoneCard
            isDragging={isDragging}
            disabled={atFileLimit}
            onBrowse={onBrowse}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
          />

          <div className="flex flex-1 flex-col items-stretch min-w-0" style={{ gap: 8 }}>
            {attachments.map((a) =>
              a.status === 'uploading' ? (
                <UploadingFileItem
                  key={a.id}
                  filename={a.name}
                  uploadedBytes={Math.floor(a.progress * a.size)}
                  totalBytes={a.size}
                  progress={a.progress}
                  isPdf={a.isPdf}
                  onCancel={() => onCancelUpload(a.id)}
                />
              ) : (
                <CompletedFileItem
                  key={a.id}
                  filename={a.name}
                  sizeLabel={formatTotalSize(a.size)}
                  isPdf={a.isPdf}
                  onDelete={() => onDeleteAttachment(a.id)}
                  onView={() => onView(a.id)}
                />
              )
            )}
          </div>
        </div>
      </div>

      <NextButton onClick={onNext} />
    </motion.div>
  );
}

/* ── Field group ── */

function FieldGroup({
  label,
  required,
  children,
  delay = 0,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  width?: number | string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28 }}
      className="flex flex-col items-start min-w-0"
      style={{ gap: 8 }}
    >
      <EditableLabel required={required}>{label}</EditableLabel>
      {children}
    </motion.div>
  );
}

/* ── Drop zone ── */

function DropZoneCard({
  isDragging,
  disabled,
  onBrowse,
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
}: {
  isDragging: boolean;
  disabled: boolean;
  onBrowse: () => void;
  onDrop: DragEventHandler<HTMLDivElement>;
  onDragOver: DragEventHandler<HTMLDivElement>;
  onDragEnter: DragEventHandler<HTMLDivElement>;
  onDragLeave: DragEventHandler<HTMLDivElement>;
}) {
  const baseZoneStyle: CSSProperties = {
    display: 'flex',
    width: 600,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'stretch',
    boxSizing: 'border-box',
    borderRadius: 12,
    border: '1px dashed #5A72A5',
    background: '#FFF',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className="shrink-0"
      style={{
        ...baseZoneStyle,
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: disabled ? 'not-allowed' : isDragging ? 'copy' : 'default',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        className="overflow-hidden flex items-center justify-center shrink-0"
        style={{ width: 32, height: 32, borderRadius: 50, background: '#F6F7F8' }}
      >
        <img
          src="/assets/cloud-arrow-up.svg"
          alt=""
          width={24}
          height={24}
          draggable={false}
        />
      </div>

      <div className="flex flex-col items-center w-full" style={{ gap: 12 }}>
        <div className="flex flex-col items-center w-full text-center" style={{ gap: 4 }}>
          <p
            className="font-poppins"
            style={{ fontSize: 16, fontWeight: 600, color: '#142952', lineHeight: 'normal' }}
          >
            Choose a file or drag &amp; drop it here
          </p>
          <p
            className="font-poppins"
            style={{ fontSize: 14, fontWeight: 500, color: '#5A72A5', lineHeight: 'normal' }}
          >
            JPEG, PNG, PDF, up to 10 MB each — add multiple files
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBrowse}
          disabled={disabled}
          className="flex items-center justify-center font-poppins transition-colors hover:bg-brand-25"
          style={{
            padding: '4px 12px',
            gap: 8,
            border: '1.5px solid #255AC3',
            borderRadius: 16,
            background: '#FFFFFF',
            color: '#255AC3',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 'normal',
          }}
        >
          <IconFilePlus size={20} />
          Browse File
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Uploading row ── */

function UploadingFileItem({
  filename,
  uploadedBytes,
  totalBytes,
  progress,
  isPdf,
  onCancel,
}: {
  filename: string;
  uploadedBytes: number;
  totalBytes: number;
  progress: number;
  isPdf: boolean;
  onCancel: () => void;
}) {
  const icon = isPdf ? '/assets/file-pdf.svg' : '/assets/file-jpg.svg';
  return (
    <motion.div
      key="uploading"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 20px',
        alignItems: 'center',
        gap: 16,
        alignSelf: 'stretch',
        borderRadius: 12,
        border: '1px solid #5A72A5',
        background: '#FFF',
      }}
    >
      <img
        src={icon}
        alt={isPdf ? 'PDF' : 'Image'}
        width={40}
        height={40}
        className="shrink-0"
        draggable={false}
      />

      <div
        className="flex flex-col flex-1 min-w-0 justify-between"
        style={{ minHeight: 0 }}
      >
        <div className="flex flex-col items-start w-full" style={{ gap: 8, minHeight: 53 }}>
          <div className="flex items-start justify-between w-full gap-2">
            <p
              className="font-poppins truncate min-w-0"
              style={{ fontSize: 16, fontWeight: 600, color: '#142952', lineHeight: 'normal' }}
            >
              {filename}
            </p>
            <button type="button" onClick={onCancel} aria-label="Cancel upload" className="shrink-0">
              <img src="/assets/x-close.svg" alt="" width={20} height={20} draggable={false} />
            </button>
          </div>
          <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
            <p
              className="font-poppins"
              style={{ fontSize: 14, fontWeight: 500, color: '#142952', lineHeight: 'normal' }}
            >
              {formatProgressPair(uploadedBytes, totalBytes)}
            </p>
            <div className="flex items-center" style={{ gap: 4 }}>
              <img
                src="/assets/spinner.svg"
                alt=""
                width={16}
                height={16}
                className="spin"
                draggable={false}
              />
              <p
                className="font-poppins"
                style={{ fontSize: 14, fontWeight: 500, color: '#5A72A5', lineHeight: 'normal' }}
              >
                Uploading
              </p>
            </div>
          </div>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{ height: 9, borderRadius: 16, background: '#E9EFFB' }}
        >
          <div
            style={{
              width: `${Math.round(progress * 100)}%`,
              height: '100%',
              background: '#255AC3',
              borderRadius: 16,
              transition: 'width 0.12s ease-out',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Completed row ── */

function CompletedFileItem({
  filename,
  sizeLabel,
  isPdf,
  onDelete,
  onView,
}: {
  filename: string;
  sizeLabel: string;
  isPdf: boolean;
  onDelete: () => void;
  onView: () => void;
}) {
  const icon = isPdf ? '/assets/file-pdf.svg' : '/assets/file-jpg.svg';
  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        width: '100%',
        height: 102,
        boxSizing: 'border-box',
        padding: '12px 20px',
        alignItems: 'center',
        gap: 16,
        alignSelf: 'stretch',
        borderRadius: 12,
        border: '1px solid #5A72A5',
        background: '#FFF',
      }}
    >
      <img
        src={icon}
        alt={isPdf ? 'PDF' : 'Image'}
        width={40}
        height={40}
        className="shrink-0"
        draggable={false}
      />

      <div className="flex flex-col flex-1 min-w-0 items-start" style={{ gap: 8 }}>
        <div className="flex items-start justify-between w-full gap-2">
          <p
            className="font-poppins truncate min-w-0"
            style={{ fontSize: 16, fontWeight: 600, color: '#142952', lineHeight: 'normal' }}
          >
            {filename}
          </p>
          <button type="button" onClick={onDelete} aria-label="Delete file" className="shrink-0">
            <img src="/assets/trash-line.svg" alt="" width={20} height={20} draggable={false} />
          </button>
        </div>
        <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
          <p
            className="font-poppins"
            style={{ fontSize: 14, fontWeight: 500, color: '#142952', lineHeight: 'normal' }}
          >
            {sizeLabel}
          </p>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              padding: '2px 12px',
              gap: 4,
              borderRadius: 16,
              background: '#D4F7D7',
              border: '0.5px solid #7AE052',
            }}
          >
            <img src="/assets/success-tick.svg" alt="" width={20} height={20} draggable={false} />
            <p
              className="font-poppins"
              style={{ fontSize: 14, fontWeight: 500, color: '#0C4111', lineHeight: '21px' }}
            >
              Completed
            </p>
          </div>
          <button
            type="button"
            onClick={onView}
            className="flex items-center justify-center shrink-0 transition-colors hover:bg-[#dcdcdc]"
            style={{
              padding: '2px 12px',
              gap: 4,
              borderRadius: 16,
              background: '#E6E6E6',
              border: '0.5px solid #999999',
            }}
          >
            <img src="/assets/eye.svg" alt="" width={20} height={14} draggable={false} />
            <span
              className="font-poppins"
              style={{ fontSize: 14, fontWeight: 500, color: '#262626', lineHeight: '21px' }}
            >
              View
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Size helpers (bytes) ── */

function formatProgressPair(uploaded: number, total: number) {
  const u = uploaded < 1024 * 1024 ? `${Math.max(0, Math.round(uploaded / 1024))}kb` : `${(uploaded / (1024 * 1024)).toFixed(1)} MB`;
  const t =
    total >= 1024 * 1024
      ? `${(total / (1024 * 1024)).toFixed(total % (1024 * 1024) === 0 ? 0 : 1)} MB`
      : `${Math.max(1, Math.round(total / 1024))}kb`;
  return `${u} of ${t}`;
}

function formatTotalSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return mb % 1 < 0.01 ? `${mb.toFixed(0)} MB` : `${mb.toFixed(1)} MB`;
  }
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}kb`;
  return `${bytes} B`;
}
