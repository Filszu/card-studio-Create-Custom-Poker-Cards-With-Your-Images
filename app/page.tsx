"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [shuffling, setShuffling] = useState(false)
  const [cards, setCards] = useState([
    { color: "#FF7E67", symbol: "♥", id: 1 },
    { color: "#89DAFF", symbol: "♠", id: 2 },
    { color: "#FFBA6B", symbol: "♦", id: 3 },
    { color: "#2D2A4A", symbol: "♣", border: "border-2 border-white/50", id: 4 },
  ])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const shuffleCards = () => {
    if (shuffling) return

    setShuffling(true)

    // First animation - cards fly to center
    setTimeout(() => {
      // Second animation - shuffle and return to positions
      const shuffled = [...cards].sort(() => Math.random() - 0.5)
      setCards(shuffled)

      setTimeout(() => {
        setShuffling(false)
      }, 500)
    }, 500)
  }

  // Auto shuffle every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      shuffleCards()
    }, 5000)

    return () => clearInterval(interval)
  }, [cards, shuffling])

  return (
    <div className="flex min-h-screen flex-col bg-[#2D2A4A]">
      <header className="container flex items-center justify-between py-6">
        <motion.div
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          CARD STUDIO
        </motion.div>
        <motion.nav
          className="hidden md:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ul className="flex space-x-8">
            {["Create", "Gallery", "How It Works", "Contact"].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (i + 1) }}
              >
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </header>

      <main className="container flex-1 py-12">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create Custom <span className="text-[#FF7E67]">Poker Cards</span> With Your Images
            </motion.h1>
            <motion.p
              className="text-lg text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Upload, customize, and export your own unique deck of poker cards. Perfect for gifts, events, or personal
              collections.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white" size="lg" asChild>
                <Link href="/create">
                  Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/95" size="lg" asChild>
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={shuffleCards}
          >
            <motion.div
              className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#89DAFF] opacity-80 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#FFBA6B] opacity-80 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {cards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    className={`absolute aspect-[2.5/3.5] w-[180px] rounded-lg ${card.border || ""}`}
                    style={{ backgroundColor: card.color, zIndex: shuffling ? 10 - i : 10 + i }}
                    initial={false}
                    animate={
                      shuffling
                        ? {
                            x: 0,
                            y: 0,
                            rotateY: 180,
                            scale: 0.8,
                            transition: { duration: 0.5 },
                          }
                        : {
                            x: i % 2 === 0 ? -40 + i * 10 : 40 - i * 10,
                            y: i % 2 === 0 ? -30 + i * 5 : 30 - i * 5,
                            rotateY: 0,
                            rotate: i * 5,
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: i * 0.1,
                            },
                          }
                    }
                    whileHover={{
                      y: -10,
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-white/90">
                      {card.symbol}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Illustration section */}
        <motion.div
          className="mt-24 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Your Perfect Deck</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Design custom poker cards for game nights, special events, or unique gifts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative w-64 h-64 mb-6 bg-white/95 rounded-full p-4">
              <Image src="/images/artist.png" alt="Design your cards" fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Design</h3>
            <p className="text-white/70 text-center">Create beautiful custom cards with your own images and designs</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 mb-6 bg-white/95 rounded-full p-4">
              <Image src="/images/card-tower.png" alt="Build your deck" fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Build</h3>
            <p className="text-white/70 text-center">Customize every card in your deck with unique images and text</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative w-64 h-64 mb-6 bg-white/95 rounded-full p-4">
              <Image src="/images/playing-cards.png" alt="Play with your cards" fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Play</h3>
            <p className="text-white/70 text-center">Export your deck and enjoy playing with your personalized cards</p>
          </motion.div>
        </div>

        <motion.div
          className="mt-24 grid gap-8 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            {
              title: "Upload Images",
              description: "Upload your favorite photos to customize each card in your deck.",
              icon: "📷",
              image: "/images/rocket.png",
            },
            {
              title: "Customize Cards",
              description: "Edit card designs with our intuitive editor. Add text, change colors, and more.",
              icon: "✏️",
              image: "/images/chess-player.png",
            },
            {
              title: "Export Your Deck",
              description: "Download individual cards or the entire deck in high resolution.",
              icon: "💾",
              image: "/images/celebration.png",
            },
          ].map((feature, i) => (
            <motion.div key={i} className="rounded-xl bg-white/5 p-6 backdrop-blur-sm" variants={item}>
              <div className="relative h-48 mb-4 bg-white/95 rounded-lg p-4">
                <Image src={feature.image || "/placeholder.svg"} alt={feature.title} fill className="object-contain" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action section */}
        <motion.div
          className="mt-24 py-16 px-8 rounded-2xl bg-white/5 backdrop-blur-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative w-64 h-64 bg-white/95 rounded-full p-4">
              <Image src="/images/flying.png" alt="Get started" fill className="object-contain" />
            </div>
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Custom Deck?</h2>
              <p className="text-white/70 mb-8">
                Start designing your personalized poker cards today and bring your creative vision to life.
              </p>
              <Button className="bg-[#FF7E67] hover:bg-[#FF7E67]/90 text-white" size="lg" asChild>
                <Link href="/create">
                  Start Creating Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Testimonials/Team section */}
        <motion.div
          className="mt-24 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-full md:w-1/2 h-64 md:h-96 bg-white/95 rounded-lg p-4">
              <Image src="/images/team-building.png" alt="Our community" fill className="object-contain" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
              <p className="text-white/70 mb-6">
                Connect with other card enthusiasts, share your designs, and get inspired by creative ideas from around
                the world.
              </p>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-start">
                  <span className="text-[#FF7E67] mr-2">✓</span>
                  <span>Share your custom deck designs with the community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7E67] mr-2">✓</span>
                  <span>Get feedback and inspiration from other creators</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF7E67] mr-2">✓</span>
                  <span>Discover new techniques and design ideas</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="container text-center text-sm text-white/60">
          © {new Date().getFullYear()} Card Studio. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
