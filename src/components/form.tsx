import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CaretDown, IconCheck, IconFilePlus, IconLink, IconPaperclip, IconPen, IconTrash, NextButtonArrow } from './icons';

export function Field({
  label,
  required,
  children,
  hint,
  className = '',
}: {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[12px] font-medium text-grey-700">
        {label}
        {required && <span className="text-accent-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <div className="text-[11px] text-grey-500">{hint}</div>}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function TextInput({ leadingIcon, trailingIcon, className = '', ...rest }: TextInputProps) {
  return (
    <div className={`relative group ${className}`}>
      {leadingIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none">
          {leadingIcon}
        </div>
      )}
      <input
        {...rest}
        className={`w-full h-10 rounded-full bg-white ring-1 ring-grey-100 focus:ring-2 focus:ring-brand-300 focus:outline-none text-[13px] text-grey-900 placeholder:text-grey-400 transition-all ${
          leadingIcon ? 'pl-9' : 'pl-4'
        } ${trailingIcon ? 'pr-10' : 'pr-4'}`}
      />
      {trailingIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500">
          {trailingIcon}
        </div>
      )}
    </div>
  );
}

export function ReadOnlyField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="px-4 py-2.5 min-w-0">
      <div className="text-[12px] text-grey-500 mb-0.5">{label}</div>
      <div
        className={`text-[14px] font-semibold truncate ${
          highlight ? 'text-brand-600' : 'text-brand-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * FetchField — Figma node 5830:83001 family.
 *
 * Input-style read-only field used to surface server-fetched values.
 * Visual tokens (locked):
 *   background : #F2F6FD
 *   border     : 1px solid #BED0F4   (per-side, see `side` prop)
 *   radius     : 12px on the outer edges only
 *   padding    : 8px 20px · gap 4px between label and value
 *   label      : Poppins Medium 14px / #2D3953
 *   value      : Poppins SemiBold 16px / #142952  (or #2C6C13 when highlighted)
 *
 * Side controls which borders are drawn so adjacent cells in a row collapse
 * into a single 1px divider (matches the Figma fetch-row composition):
 *   left   → top + bottom + left,  rounded-l
 *   middle → top + bottom + left  (the prior cell's right border)
 *   right  → top + bottom + left + right, rounded-r
 *   single → all four borders + both rounded sides
 */
export type FetchFieldSide = 'left' | 'middle' | 'right' | 'single';

export function FetchField({
  label,
  value,
  side = 'single',
  highlight,
  onChange,
  readOnly = true,
}: {
  label: string;
  value: string;
  side?: FetchFieldSide;
  highlight?: boolean;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const isLeft = side === 'left' || side === 'single';
  const isRight = side === 'right' || side === 'single';
  const border = '1px solid #BED0F4';

  return (
    <div
      className="flex flex-col items-start justify-center min-w-0 flex-1 self-stretch"
      style={{
        background: '#F2F6FD',
        padding: '8px 20px',
        gap: 4,
        borderTop: border,
        borderBottom: border,
        borderLeft: border,
        borderRight: isRight ? border : 'none',
        borderTopLeftRadius: isLeft ? 12 : 0,
        borderBottomLeftRadius: isLeft ? 12 : 0,
        borderTopRightRadius: isRight ? 12 : 0,
        borderBottomRightRadius: isRight ? 12 : 0,
      }}
    >
      <label
        className="font-poppins select-none"
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#2D3953',
          lineHeight: 'normal',
        }}
      >
        {label}
      </label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={label}
        className="font-poppins w-full bg-transparent border-0 outline-none p-0 truncate cursor-default focus:outline-none"
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: highlight ? '#2C6C13' : '#142952',
          lineHeight: 'normal',
        }}
      />
    </div>
  );
}

export function SelectInput({
  placeholder,
  leadingIcon,
  value,
  onClick,
  className = '',
}: {
  placeholder?: string;
  leadingIcon?: ReactNode;
  value?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full h-10 rounded-full bg-white ring-1 ring-grey-100 hover:ring-brand-300 focus:ring-2 focus:ring-brand-300 transition-all text-left text-[13px] pr-10 ${
        leadingIcon ? 'pl-9' : 'pl-4'
      } ${className}`}
    >
      {leadingIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500">{leadingIcon}</div>
      )}
      <span className={value ? 'text-grey-900' : 'text-grey-400'}>{value || placeholder}</span>
      <CaretDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-500" />
    </button>
  );
}

export function PillToggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`h-9 px-4 rounded-full text-[13px] font-medium flex items-center gap-2 ring-1 transition-all ${
              active
                ? 'bg-brand-500 text-white ring-brand-500 shadow-[0_4px_10px_-4px_rgba(27,85,126,0.45)]'
                : 'bg-grey-25 text-grey-700 ring-grey-100 hover:bg-white'
            }`}
          >
            <span>{o.label}</span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                active ? 'bg-white' : 'bg-grey-100'
              }`}
            >
              {active && <IconCheck size={10} className="text-brand-500" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AttachmentField({ filename, onSelect }: { filename: string; onSelect?: () => void }) {
  void onSelect;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-10 rounded-full bg-white ring-1 ring-grey-100 flex items-center px-3 text-[13px] text-grey-700 gap-2">
        <IconLink size={14} className="text-brand-500" />
        <span className="truncate">{filename}</span>
      </div>
      <button
        className="font-poppins flex items-center justify-center gap-2 transition-colors hover:bg-[#EFF4FC]"
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
      </button>
      <button className="h-10 px-4 rounded-full bg-accent-red-500 text-white text-[12px] font-semibold flex items-center gap-2 hover:brightness-110 transition">
        Delete
      </button>
    </div>
  );
}

/**
 * EditableLabel — Figma node 5830:83877 family.
 *  Poppins SemiBold 16px / #2D3953  · required marker #B8141A
 */
export function EditableLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <p
      className="font-poppins"
      style={{ fontSize: 16, fontWeight: 600, color: '#2D3953', lineHeight: 'normal' }}
    >
      {children}
      {required && <span style={{ color: '#B8141A' }}> *</span>}
    </p>
  );
}

/**
 * EditableField — Figma node 5830:83879 family.
 *
 * Single-row editable input used across the form. Shape mirrors the design:
 *   Pen-icon button (40×40, bg #E9EFFB, border #5A72A5, rounded-l 12) — when
 *   the field is `readOnly` the button is non-interactive but visually present.
 *   Input area: h-40, bg #E9EFFB, border-t/b/r #5A72A5, rounded-r 12,
 *   padding 12 / 10, placeholder Poppins Medium 14 / #5A72A5.
 *
 * Wrap in a parent that provides `EditableLabel` + 8px gap to match the
 * Figma label/field pair (node 5830:83876).
 */
export function EditableField({
  value,
  onChange,
  placeholder,
  type = 'text',
  onIconClick,
  ariaLabel,
  className = '',
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'date' | 'number';
  onIconClick?: () => void;
  ariaLabel?: string;
  className?: string;
}) {
  const border = '1px solid #5A72A5';
  return (
    <div className={`flex items-center w-full ${className}`}>
      <button
        type="button"
        onClick={onIconClick}
        aria-label="Edit"
        className="flex items-center justify-center shrink-0 transition-colors hover:bg-[#dde4f5]"
        style={{
          width: 40,
          height: 40,
          background: '#E9EFFB',
          border,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        }}
      >
        <IconPen size={24} className="text-[#5A72A5]" />
      </button>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="font-poppins flex-1 min-w-0 outline-none"
        style={{
          height: 40,
          padding: '10px 12px',
          background: '#E9EFFB',
          borderTop: border,
          borderRight: border,
          borderBottom: border,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          fontSize: 14,
          fontWeight: 500,
          color: '#142952',
        }}
      />
    </div>
  );
}

/**
 * AttachmentPicker — Figma node 5830:83944.
 *
 * Dashed drop-zone preview + (Select File / Delete) action stack. Heights and
 * colors are pixel-locked to the design:
 *   Drop zone : flex-1 · h-66 · padding 10 · dashed 1px #5A72A5 · radius 8
 *               icon 24×24 Paperclip + filename Poppins Medium 14 / #5A72A5
 *   Buttons   : 122px column · gap 8
 *               Select File — bg white · border 1.5px #255AC3 · text #255AC3
 *               Delete      — bg #B8141A · text white
 *               Both: rounded 16, padding 12 / 4, Poppins Medium 14
 */
export function AttachmentPicker({
  filename,
  onSelect,
  onDelete,
}: {
  filename: string;
  onSelect?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex flex-1 items-center justify-center min-w-0"
        style={{
          height: 66,
          padding: 10,
          border: '1px dashed #5A72A5',
          borderRadius: 8,
        }}
      >
        <div className="flex items-center justify-center" style={{ gap: 8 }}>
          <IconPaperclip size={24} className="text-[#5A72A5] shrink-0" />
          <span
            className="font-poppins truncate"
            style={{ fontSize: 14, fontWeight: 500, color: '#5A72A5', lineHeight: 'normal' }}
          >
            {filename}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start shrink-0" style={{ width: 122, gap: 8 }}>
        <button
          type="button"
          onClick={onSelect}
          className="flex items-center justify-center font-poppins transition-colors hover:bg-[#EFF4FC]"
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
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center w-full font-poppins text-white transition-[filter] hover:brightness-110"
          style={{
            padding: '4px 12px',
            gap: 8,
            borderRadius: 16,
            background: '#B8141A',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 'normal',
          }}
        >
          <IconTrash size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

/**
 * NextButton — Figma node 5830:83076 / 5830:83571.
 *
 * Locked spec — DO NOT alter without updating Figma:
 *   width 100 · height 48 · padding 10 / 24 · gap 8
 *   border-radius 16 · border 1.5px solid #255AC3 · background #FFFFFF
 *   Label "Next" — Poppins SemiBold 16 / #255AC3
 *   Trailing filled chevron — Figma 5938:50701, NextButtonArrow 20×20 (currentColor)
 *
 * Used as the per-section "advance to the next step" CTA. Single source of
 * truth — every section imports this so the buttons stay byte-identical.
 */
export function NextButton({
  onClick,
  label = 'Next',
  className = '',
}: {
  onClick?: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1, boxShadow: '0 8px 18px -8px rgba(37,90,195,0.45)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center justify-center font-poppins shrink-0 group ${className}`}
      style={{
        width: 100,
        height: 48,
        padding: '10px 24px',
        gap: 8,
        borderRadius: 16,
        border: '1.5px solid #255AC3',
        background: '#FFFFFF',
        color: '#255AC3',
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 'normal',
      }}
    >
      <span>{label}</span>
      <NextButtonArrow
        size={20}
        className="shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
        aria-hidden
      />
    </motion.button>
  );
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'success' | 'warning';
}) {
  const variants = {
    primary:
      'bg-brand-500 text-white hover:bg-brand-600 shadow-[0_4px_10px_-4px_rgba(27,85,126,0.45)]',
    outline:
      'bg-white text-brand-600 ring-1 ring-brand-100 hover:bg-brand-10',
    success:
      'bg-[#C9F2B5] text-accent-green-600 ring-1 ring-[#A5E88A] hover:bg-[#BDE8A6]',
    warning:
      'bg-accent-yellow-200 text-accent-yellow-800 hover:bg-accent-yellow-500',
  };
  return (
    <button
      {...props}
      className={`h-10 px-5 rounded-full text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
