import { HomePage } from '../pages/HomePage'
import { AppProviders } from './providers'

export default function App() {
  return (
    <AppProviders>
      <div className="app-shell">
        <main className="app-shell__main">
          <HomePage />
        </main>
      </div>
    </AppProviders>
  )
}
