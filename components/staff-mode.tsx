'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquarePlus, Pin, Trash2, X, Palette, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type Brand = 'sea' | 'gold'

type Annotation = {
  id: string
  path: string
  xPercent: number
  yPercent: number
  text: string
  createdAt: number
}

type StaffModeContextValue = {
  staffMode: boolean
  setStaffMode: (v: boolean) => void
  brand: Brand
  setBrand: (b: Brand) => void
  annotationArmed: boolean
  setAnnotationArmed: (v: boolean) => void
  annotations: Annotation[]
  addAnnotation: (a: Omit<Annotation, 'id' | 'createdAt'>) => void
  removeAnnotation: (id: string) => void
}

const StaffModeContext = React.createContext<StaffModeContextValue | null>(null)

const STORAGE_KEY = 'laac-staff-mode'
const NOTES_KEY = 'laac-staff-annotations'

export function useStaffMode() {
  const ctx = React.useContext(StaffModeContext)
  if (!ctx) throw new Error('useStaffMode must be used within StaffModeProvider')
  return ctx
}

export function StaffModeProvider({ children }: { children: React.ReactNode }) {
  const [staffMode, setStaffModeState] = React.useState(false)
  const [brand, setBrandState] = React.useState<Brand>('sea')
  const [annotationArmed, setAnnotationArmed] = React.useState(false)
  const [annotations, setAnnotations] = React.useState<Annotation[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    try {
      const rawMode = window.localStorage.getItem(STORAGE_KEY)
      if (rawMode) {
        const parsed = JSON.parse(rawMode) as { staffMode: boolean; brand: Brand }
        setStaffModeState(!!parsed.staffMode)
        setBrandState(parsed.brand === 'gold' ? 'gold' : 'sea')
      }
      const rawNotes = window.localStorage.getItem(NOTES_KEY)
      if (rawNotes) setAnnotations(JSON.parse(rawNotes) as Annotation[])
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    document.documentElement.dataset.brand = brand
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ staffMode, brand }))
  }, [staffMode, brand, hydrated])

  React.useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(annotations))
  }, [annotations, hydrated])

  React.useEffect(() => {
    if (!staffMode) setAnnotationArmed(false)
  }, [staffMode])

  const setStaffMode = React.useCallback((v: boolean) => setStaffModeState(v), [])
  const setBrand = React.useCallback((b: Brand) => setBrandState(b), [])

  const addAnnotation = React.useCallback((a: Omit<Annotation, 'id' | 'createdAt'>) => {
    setAnnotations((prev) => [
      ...prev,
      { ...a, id: `note-${Date.now()}-${Math.round(Math.random() * 1000)}`, createdAt: Date.now() },
    ])
  }, [])

  const removeAnnotation = React.useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const value = React.useMemo(
    () => ({
      staffMode,
      setStaffMode,
      brand,
      setBrand,
      annotationArmed,
      setAnnotationArmed,
      annotations,
      addAnnotation,
      removeAnnotation,
    }),
    [staffMode, setStaffMode, brand, setBrand, annotationArmed, annotations, addAnnotation, removeAnnotation],
  )

  return (
    <StaffModeContext.Provider value={value}>
      {children}
      {hydrated && staffMode && <AnnotationLayer />}
      {hydrated && <StaffModePanel />}
    </StaffModeContext.Provider>
  )
}

function AnnotationLayer() {
  const pathname = usePathname()
  const { annotationArmed, setAnnotationArmed, annotations, addAnnotation, removeAnnotation } = useStaffMode()
  const [draft, setDraft] = React.useState<{ x: number; y: number; xPercent: number; yPercent: number } | null>(null)
  const [openNoteId, setOpenNoteId] = React.useState<string | null>(null)
  const draftText = React.useRef('')

  const pageNotes = annotations.filter((a) => a.path === pathname)

  function handlePageClick(e: React.MouseEvent) {
    if (!annotationArmed) return
    const target = e.target as HTMLElement
    if (target.closest('[data-staff-ui]')) return
    const doc = document.documentElement
    const xPercent = (e.pageX / doc.scrollWidth) * 100
    const yPercent = (e.pageY / doc.scrollHeight) * 100
    setDraft({ x: e.pageX, y: e.pageY, xPercent, yPercent })
    draftText.current = ''
  }

  return (
    <div
      className={cn('fixed inset-0 z-[70]', annotationArmed ? 'cursor-crosshair' : 'pointer-events-none')}
      onClick={handlePageClick}
      style={{ pointerEvents: annotationArmed ? 'auto' : 'none' }}
    >
      {pageNotes.map((note, i) => (
        <div
          key={note.id}
          data-staff-ui
          className="pointer-events-auto absolute"
          style={{ left: `${note.xPercent}%`, top: `${note.yPercent}%` }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setOpenNoteId(openNoteId === note.id ? null : note.id)
            }}
            className="relative flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-deep bg-gold text-[11px] font-bold text-ink shadow-paper"
            aria-label={`Annotation ${i + 1}: ${note.text}`}
          >
            {i + 1}
          </button>
          {openNoteId === note.id && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 top-7 w-64 -translate-x-1/2 rounded-md border border-line bg-card p-3 text-left shadow-paper-lg"
            >
              <p className="font-mono text-xs leading-relaxed text-ink-soft">{note.text}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft/70">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    removeAnnotation(note.id)
                    setOpenNoteId(null)
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-danger hover:underline"
                >
                  <Trash2 className="size-3" />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {draft && (
        <div
          data-staff-ui
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto absolute w-72 -translate-x-1/2 rounded-md border border-gold-deep bg-card p-3 shadow-paper-lg"
          style={{ left: `${draft.xPercent}%`, top: `${draft.yPercent}%` }}
        >
          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-gold-deep">
            <Pin className="size-3" />
            New annotation
          </div>
          <Textarea
            autoFocus
            placeholder="Leave a note for the team…"
            className="min-h-20 resize-none border-line bg-background text-sm"
            onChange={(e) => {
              draftText.current = e.target.value
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setDraft(null)
            }}
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-gold text-ink hover:bg-gold-deep"
              onClick={() => {
                if (!draftText.current.trim()) {
                  setDraft(null)
                  return
                }
                addAnnotation({
                  path: pathname,
                  xPercent: draft.xPercent,
                  yPercent: draft.yPercent,
                  text: draftText.current.trim(),
                })
                setDraft(null)
                setAnnotationArmed(false)
              }}
            >
              Pin note
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function StaffModePanel() {
  const pathname = usePathname()
  const {
    staffMode,
    setStaffMode,
    brand,
    setBrand,
    annotationArmed,
    setAnnotationArmed,
    annotations,
    removeAnnotation,
  } = useStaffMode()
  const [expanded, setExpanded] = React.useState(false)
  const pageNoteCount = annotations.filter((a) => a.path === pathname).length

  return (
    <div data-staff-ui className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-2">
      {expanded && (
        <div className="w-72 rounded-lg border border-line bg-card p-4 shadow-paper-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">Staff review mode</span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-ink-soft hover:text-ink"
              aria-label="Close staff panel"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="text-sm font-medium text-ink">Staff mode</p>
              <p className="text-xs text-ink-soft">Reveal internal tools on this page</p>
            </div>
            <Switch checked={staffMode} onCheckedChange={setStaffMode} aria-label="Toggle staff mode" />
          </div>

          <div className={cn('flex flex-col gap-3 pt-3', !staffMode && 'opacity-40')}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-ink">
                <PenLine className="size-4 text-ink-soft" />
                Annotation layer
              </div>
              <Switch
                checked={annotationArmed}
                onCheckedChange={setAnnotationArmed}
                disabled={!staffMode}
                aria-label="Arm annotation layer"
              />
            </div>
            {annotationArmed && (
              <p className="rounded-md bg-paper-2 px-2.5 py-2 font-mono text-[11px] leading-relaxed text-ink-soft">
                Click anywhere on the page to drop a note. {pageNoteCount} note{pageNoteCount === 1 ? '' : 's'} on
                this page.
              </p>
            )}
            {!annotationArmed && pageNoteCount > 0 && (
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] text-ink-soft">
                  {pageNoteCount} note{pageNoteCount === 1 ? '' : 's'} pinned here
                </p>
                <button
                  type="button"
                  onClick={() => annotations.filter((a) => a.path === pathname).forEach((a) => removeAnnotation(a.id))}
                  className="font-mono text-[11px] uppercase tracking-wide text-danger hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="border-t border-line pt-3">
              <div className="mb-2 flex items-center gap-2 text-sm text-ink">
                <Palette className="size-4 text-ink-soft" />
                Brand alternative
              </div>
              <div className="grid grid-cols-2 gap-1.5 rounded-md border border-line bg-paper-2 p-1">
                <button
                  type="button"
                  disabled={!staffMode}
                  onClick={() => setBrand('sea')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors',
                    brand === 'sea' ? 'bg-card text-ink shadow-paper-sm' : 'text-ink-soft',
                  )}
                >
                  <span className="size-2.5 rounded-full bg-[#0f4c5c]" />
                  Cool sea
                </button>
                <button
                  type="button"
                  disabled={!staffMode}
                  onClick={() => setBrand('gold')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors',
                    brand === 'gold' ? 'bg-card text-ink shadow-paper-sm' : 'text-ink-soft',
                  )}
                >
                  <span className="size-2.5 rounded-full bg-[#8c6d12]" />
                  Warm gold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        size="icon"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          'size-11 rounded-full shadow-paper-lg',
          staffMode ? 'bg-gold text-ink hover:bg-gold-deep' : 'bg-ink text-paper hover:bg-ink/90',
        )}
        aria-label="Open staff review panel"
      >
        <MessageSquarePlus className="size-5" />
      </Button>
    </div>
  )
}
