'use client'

import Image from 'next/image'
import Link from 'next/link'
import { home, portfolio, config } from '@/content'
import { assetPath } from '@/utils/basePath'
import EditableText from '@/components/ui/EditableText'
import ProgressTracker from '@/components/ui/ProgressTracker'
import InstagramSection from '@/components/ui/InstagramSection'

export default function HomePage() {
  const homepageFilenames = [
    'P1020609.JPG',
    'P1020654.JPG',
    '278be70b-84b1-4307-a134-b0346450db53.jpg',
    'IMG_3811.jpg',
    'P1000184.JPG',
    'P1000172.JPG',
  ]

  const homepageItems = homepageFilenames
    .map((filename) => portfolio.items.find((item) => item.filename === filename))
    .filter((item): item is (typeof portfolio.items)[number] => Boolean(item))

  const previewItems = homepageItems
  const heroItems = homepageItems

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-walnut text-cream overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-walnut via-walnut to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <EditableText file="config" path="siteName" as="p" className="font-display text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide text-accent-light uppercase">{config.siteName}</EditableText>
            <EditableText file="home" path="hero.headline" as="h1" className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">{home.hero.headline}</EditableText>
            <EditableText file="home" path="hero.subheadline" as="p" className="text-lg md:text-xl text-cream/80 mb-10 max-w-2xl mx-auto lg:mx-0">{home.hero.subheadline}</EditableText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/order/" className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded text-lg font-medium transition-colors"><EditableText file="home" path="hero.ctaPrimary">{home.hero.ctaPrimary}</EditableText></Link>
              <Link href="/portfolio/" className="border-2 border-cream/50 hover:border-cream text-cream px-8 py-3 rounded text-lg transition-colors"><EditableText file="home" path="hero.ctaSecondary">{home.hero.ctaSecondary}</EditableText></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-5">
            {heroItems.map((item, i) => (
              <Link key={`${item.filename}-${i}`} href="/portfolio/" className={`group relative overflow-hidden rounded-xl bg-black/20 shadow-2xl ring-1 ring-cream/10 ${i === 0 ? 'aspect-[4/5]' : i === 1 ? 'aspect-square mt-8' : 'aspect-square'}`}>
                <Image src={assetPath(`/photos/portfolio/${item.filename}`)} alt={item.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" priority={i < 2} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3"><p className="text-sm md:text-base font-medium text-white drop-shadow">{item.title}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <EditableText file="home" path="storyHighlight.heading" as="h2" className="font-display text-3xl md:text-4xl text-walnut mb-6">{home.storyHighlight.heading}</EditableText>
          <EditableText file="home" path="storyHighlight.text" as="p" className="text-muted text-lg leading-relaxed mb-8" multiline>{home.storyHighlight.text}</EditableText>
          {home.progressTracker.enabled && <ProgressTracker label={home.progressTracker.label} percentage={home.progressTracker.percentage} />}
        </div>
      </section>
      <section className="py-20 bg-warm-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <EditableText file="home" path="portfolioPreview.heading" as="h2" className="font-display text-3xl md:text-4xl text-walnut mb-3">{home.portfolioPreview.heading}</EditableText>
            <EditableText file="home" path="portfolioPreview.subheading" as="p" className="text-muted text-lg">{home.portfolioPreview.subheading}</EditableText>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewItems.map((item, i) => (
              <Link key={i} href="/portfolio/" className="group relative aspect-square overflow-hidden rounded-lg bg-border">
                <Image src={assetPath(`/photos/portfolio/${item.filename}`)} alt={item.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"><div className="absolute bottom-4 left-4 right-4"><p className="text-white font-medium">{item.title}</p></div></div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10"><Link href="/portfolio/" className="text-walnut hover:text-oak font-medium border-b-2 border-walnut/30 hover:border-walnut transition-colors pb-1">View All Projects &rarr;</Link></div>
        </div>
      </section>
      <InstagramSection />
      <section className="py-20 bg-walnut text-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <EditableText file="home" path="ctaSection.heading" as="h2" className="font-display text-3xl md:text-5xl mb-8">{home.ctaSection.heading}</EditableText>
          <Link href="/order/" className="inline-block bg-accent hover:bg-accent-light text-white px-10 py-4 rounded text-lg font-medium transition-colors"><EditableText file="home" path="ctaSection.buttonText">{home.ctaSection.buttonText}</EditableText></Link>
        </div>
      </section>
    </>
  )
}
