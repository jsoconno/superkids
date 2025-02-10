"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useKids } from "@/providers/kids-provider"
import { PlayCircle, Rocket } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const { kids } = useKids()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Super Kids!
          </h1>

          <p className="text-2xl text-muted-foreground mb-8">
            Transform everyday activities into superhero adventures!
            Help your children develop healthy habits through fun,
            superhero-themed daily activities.
          </p>

          <div className="grid gap-6 text-left md:grid-cols-2 mb-12">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">🦸‍♂️ Daily Superhero Activities</h3>
              <p className="text-muted-foreground">
                Each day brings new superhero-themed activities designed to keep your kids active and engaged.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">📊 Track Progress</h3>
              <p className="text-muted-foreground">
                Watch as your super kids complete activities and grow stronger each day with fun progress tracking.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">🎮 Fun Gamification</h3>
              <p className="text-muted-foreground">
                Turn daily tasks into exciting missions with our superhero-themed interface and reward system.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">👨‍👩‍👧‍👦 Family-Friendly</h3>
              <p className="text-muted-foreground">
                Create profiles for all your kids and let them each choose their own superhero journey.
              </p>
            </div>
          </div>

          {kids.length > 0 ? (
            <Button
              size="lg"
              className="gap-2"
              onClick={() => router.push('/dashboard')}
            >
              <PlayCircle className="w-5 h-5" />
              Let&apos;s Play!
            </Button>
          ) : (
            <Button
              size="lg"
              className="gap-2"
              onClick={() => router.push('/kids')}
            >
              <Rocket className="w-5 h-5" />
              Get Started
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}

