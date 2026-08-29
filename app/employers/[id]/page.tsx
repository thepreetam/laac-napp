import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, MapPinIcon, LanguagesIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { employers, getEmployer, getRegion, rolesForEmployer } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function generateStaticParams() {
  return employers.map((e) => ({ id: e.id }))
}

export default async function EmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const employer = getEmployer(id)
  if (!employer) notFound()

  const region = getRegion(employer.region)
  const roles = rolesForEmployer(employer.id)

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
      <Link
        href="/employers"
        data-no-underline
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sea"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
        All employers
      </Link>

      <header className="mt-6 flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-3xl leading-tight text-ink md:text-4xl">{employer.name}</h1>
            {employer.hiresPreBar && (
              <Badge className="border-clay/40 bg-clay/10 text-clay">Pre-bar hire</Badge>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPinIcon className="size-3.5" aria-hidden="true" />
            {region?.name} · {employer.counties.join(", ")}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Founded {employer.founded}</p>
        </div>
        <Button
          nativeButton={false}
          className="bg-sea text-paper hover:bg-sea/90"
          render={<Link href="/onboarding/student" />}
        >
          See if you match
        </Button>
      </header>

      <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft">
        {employer.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {employer.practiceAreas.map((area) => (
          <Badge key={area} variant="secondary" className="text-ink-soft">
            {area}
          </Badge>
        ))}
        {employer.ruralPlacement && (
          <Badge variant="outline" className="border-sea text-sea">
            Rural placement
          </Badge>
        )}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-soft">
        <LanguagesIcon className="size-3.5" aria-hidden="true" />
        Languages spoken in-office:{" "}
        {employer.languages.length > 0 ? employer.languages.join(", ") : "English"}
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink">Open roles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id} className="border-line shadow-paper-sm">
              <CardHeader>
                <CardTitle className="font-display text-base font-semibold leading-snug text-ink">
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm text-ink-soft">
                <p className="flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5" aria-hidden="true" />
                  {role.county} County · {role.hybrid ? "Hybrid" : "In-person"}
                </p>
                <p className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5" aria-hidden="true" />
                  Starts{" "}
                  {new Date(role.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="flex items-center gap-1.5">
                  <ClockIcon className="size-3.5" aria-hidden="true" />
                  {role.hoursPerWeek} hrs/week
                  {role.stipend ? ` · ${role.stipend} stipend` : ""}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {role.preBarHire && (
                    <Badge className="border-clay/40 bg-clay/10 text-clay">Pre-bar</Badge>
                  )}
                  {role.rule942 && (
                    <Badge variant="outline" className="border-sea text-sea">
                      Rule 9.42 supervised
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
