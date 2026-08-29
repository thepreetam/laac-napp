"use client"

import { useMemo, useState } from "react"
import { employers, regions } from "@/lib/data"
import { EmployerCard } from "@/components/employer-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchIcon } from "lucide-react"
import type { Region } from "@/lib/types"

export default function EmployersPage() {
  const [query, setQuery] = useState("")
  const [region, setRegion] = useState<Region | "all">("all")
  const [practiceArea, setPracticeArea] = useState<string>("all")

  const practiceAreas = useMemo(() => {
    const set = new Set<string>()
    employers.forEach((e) => e.practiceAreas.forEach((p) => set.add(p)))
    return ["all", ...Array.from(set).sort()]
  }, [])

  const filtered = useMemo(() => {
    return employers.filter((e) => {
      const matchesQuery =
        query.trim().length === 0 ||
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.counties.some((c) => c.toLowerCase().includes(query.toLowerCase()))
      const matchesRegion = region === "all" || e.region === region
      const matchesPractice =
        practiceArea === "all" || e.practiceAreas.includes(practiceArea as never)
      return matchesQuery && matchesRegion && matchesPractice
    })
  }, [query, region, practiceArea])

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-sea">
          Employer directory
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
          Legal aid organizations hiring across California
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-ink/70">
          {employers.length} organizations post fellowships, staff attorney
          roles, and post-bar positions through the pipeline. Browse by
          region, practice area, or search by name.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or county"
            className="pl-9"
            aria-label="Search employers"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={region} onValueChange={(v) => setRegion(v as Region | "all")}>
            <SelectTrigger className="w-[190px]" aria-label="Filter by region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={practiceArea} onValueChange={setPracticeArea}>
            <SelectTrigger className="w-[190px]" aria-label="Filter by practice area">
              <SelectValue placeholder="Practice area" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {practiceAreas.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "all" ? "All practice areas" : p}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.1em] text-ink/45">
        {filtered.length} organization{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {filtered.map((employer) => (
          <EmployerCard key={employer.id} employer={employer} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 rounded-md border border-dashed border-line py-16 text-center">
          <p className="font-serif text-xl text-ink">No organizations match those filters</p>
          <p className="mt-2 text-sm text-ink-soft">
            Try clearing the region or practice area filter.
          </p>
        </div>
      )}
    </div>
  )
}
