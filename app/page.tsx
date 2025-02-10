"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useKids } from "@/providers/kids-provider"
import { PlayCircle, Rocket, Star, Zap, Trophy, Shield, Sparkles, Heart } from "lucide-react"
import { motion } from "framer-motion"

// Floating animation for decorative elements
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const FeatureCard = ({ icon: Icon, title, description, delay }: {
  icon: any,
  title: string,
  description: string,
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm card-hover-effect"
  >
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  </motion.div>
)

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function LandingPage() {
  const router = useRouter()
  const { kids } = useKids()

  return (
    <main className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff9500]/20 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#4cd964]/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#5856d6]/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item} className="mb-8">
            <h1 className="text-7xl font-extrabold mb-6 text-foreground text-glow">
              Welcome to Super Kids!
            </h1>
            <p className="text-2xl text-foreground">
              Transform everyday activities into <span className="text-[#007aff] font-semibold">superhero adventures!</span>
            </p>
          </motion.div>

          <motion.div variants={item} className="mb-16">
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Help your children develop healthy habits through fun,
              superhero-themed daily activities that make every day an adventure.
            </p>
          </motion.div>

          <motion.div variants={item} className="mb-20">
            {kids.length > 0 ? (
              <Button
                size="lg"
                variant="default"
                className="gap-2 relative animate-rainbow-border text-primary-foreground hover:text-primary-foreground"
                onClick={() => router.push('/dashboard')}
              >
                <PlayCircle className="w-6 h-6" />
                Let&apos;s Play!
              </Button>
            ) : (
              <Button
                size="lg"
                variant="default"
                className="gap-2 relative animate-rainbow-border text-primary-foreground hover:text-primary-foreground"
                onClick={() => router.push('/kids')}
              >
                <Rocket className="w-6 h-6" />
                Start Your Adventure
              </Button>
            )}
          </motion.div>

          <motion.div
            variants={container}
            className="grid gap-6 md:grid-cols-2 mb-12"
          >
            <FeatureCard
              icon={Star}
              title="Daily Activities"
              description="Exciting superhero-themed activities designed to keep your kids active and engaged every day."
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="Track Progress"
              description="Watch your super kids grow stronger with fun progress tracking and achievements."
              delay={0.4}
            />
            <FeatureCard
              icon={Trophy}
              title="Fun Rewards"
              description="Turn daily tasks into exciting missions with our superhero reward system."
              delay={0.5}
            />
            <FeatureCard
              icon={Heart}
              title="Family-Friendly"
              description="Create profiles for all your kids and let them choose their own superhero journey."
              delay={0.6}
            />
          </motion.div>

          <motion.div variants={item} className="text-center text-muted-foreground">
            <p className="text-sm">
              Made with <Heart className="inline-block w-4 h-4 text-red-500" /> for super families
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

