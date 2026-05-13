import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!installEvent || dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-center gap-3 z-50">
      <span className="text-2xl">🐾</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Add Pawsport to your home screen</p>
        <p className="text-xs text-gray-500">Quick access to pet travel info, even offline</p>
      </div>
      <button
        onClick={async () => {
          await installEvent.prompt()
          const { outcome } = await installEvent.userChoice
          if (outcome === 'accepted' || outcome === 'dismissed') {
            setInstallEvent(null)
          }
        }}
        className="text-sm font-medium text-purple-600 whitespace-nowrap"
      >
        Install
      </button>
      <button onClick={() => setDismissed(true)} className="text-gray-400 text-sm">✕</button>
    </div>
  )
}
