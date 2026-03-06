import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { SplashScreen } from '@/components/SplashScreen'
import { DoughnutFullPage } from '@/components/DoughnutFullPage'

function App() {
  const { metrics, loadFromCsv } = useAppStore()
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('doughnut-splash-shown'),
  )

  useEffect(() => {
    loadFromCsv(false).catch(() => {})
  }, [loadFromCsv])

  const handleSplashFinish = () => {
    sessionStorage.setItem('doughnut-splash-shown', 'true')
    setShowSplash(false)
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onFinish={handleSplashFinish} />
      ) : (
        <motion.div
          key="doughnut"
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <DoughnutFullPage data={metrics} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
