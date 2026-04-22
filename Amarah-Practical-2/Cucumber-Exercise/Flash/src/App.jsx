import { useEffect, useRef, useState } from 'react'
import './App.css'

const VALID_USER = 'flash_user'
const VALID_PASS = 'secure123'
const INITIAL_BALANCE = 1000
const WITHDRAW_LIMIT = 5000
const FEEDBACK_DURATION_MS = 3000
const LATENCY_MS = 500

function formatRand(value) {
  return `R${new Intl.NumberFormat('en-ZA').format(value)}`
}

function getStatusClass(type) {
  if (type === 'success') {
    return 'status status-success'
  }
  return 'status status-fail'
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const [loginStatus, setLoginStatus] = useState(null)

  const [balance, setBalance] = useState(INITIAL_BALANCE)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawStatus, setWithdrawStatus] = useState(null)

  const [network, setNetwork] = useState('Vodacom')
  const [topupAmount, setTopupAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [topupBusy, setTopupBusy] = useState(false)
  const [topupStatus, setTopupStatus] = useState(null)

  const [activityLogs, setActivityLogs] = useState([])
  const statusTimers = useRef({})
  const timeoutPool = useRef([])

  const scheduleTimeout = (callback, ms) => {
    const id = window.setTimeout(callback, ms)
    timeoutPool.current.push(id)
    return id
  }

  const setTimedStatus = (key, setter, nextStatus) => {
    if (statusTimers.current[key]) {
      window.clearTimeout(statusTimers.current[key])
    }

    setter(nextStatus)
    statusTimers.current[key] = window.setTimeout(() => {
      setter(null)
    }, FEEDBACK_DURATION_MS)
  }

  const addLog = (message) => {
    const stamp = new Date().toLocaleTimeString('en-ZA', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    setActivityLogs((prev) => [
      { id: `${Date.now()}-${Math.random()}`, stamp, message },
      ...prev,
    ])
  }

  useEffect(() => {
    return () => {
      Object.values(statusTimers.current).forEach((timerId) => {
        window.clearTimeout(timerId)
      })
      timeoutPool.current.forEach((timerId) => {
        window.clearTimeout(timerId)
      })
    }
  }, [])

  const handleSignIn = (event) => {
    event.preventDefault()
    setLoginBusy(true)

    scheduleTimeout(() => {
      if (username === VALID_USER && password === VALID_PASS) {
        setTimedStatus('login', setLoginStatus, {
          type: 'success',
          text: 'SUCCESS - Access Granted. Redirecting to Dashboard...',
        })
        addLog('Login SUCCESS')
        setLoginBusy(false)

        scheduleTimeout(() => {
          setIsAuthenticated(true)
          setUsername('')
          setPassword('')
        }, FEEDBACK_DURATION_MS)

        return
      }

      setTimedStatus('login', setLoginStatus, {
        type: 'fail',
        text: 'FAILED - Invalid merchant credentials.',
      })
      addLog('Login FAILED')
      setLoginBusy(false)
    }, LATENCY_MS)
  }

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount)

    if (!amount || amount <= 0) {
      setTimedStatus('withdraw', setWithdrawStatus, {
        type: 'fail',
        text: 'FAILED',
      })
      addLog('Withdrawal FAILED - invalid amount')
      return
    }

    if (amount > WITHDRAW_LIMIT) {
      setTimedStatus('withdraw', setWithdrawStatus, {
        type: 'fail',
        text: 'FAILED - Daily Limit Exceeded',
      })
      addLog(`Withdrawal FAILED - daily limit exceeded (${formatRand(amount)})`)
      return
    }

    if (amount > balance) {
      setTimedStatus('withdraw', setWithdrawStatus, {
        type: 'fail',
        text: 'FAILED',
      })
      addLog(`Withdrawal FAILED - insufficient funds (${formatRand(amount)})`)
      return
    }

    setBalance((prev) => prev - amount)
    setTimedStatus('withdraw', setWithdrawStatus, {
      type: 'success',
      text: 'SUCCESS',
    })
    addLog(`Withdrawal SUCCESS (${formatRand(amount)})`)
    setWithdrawAmount('')
  }

  const handlePurchase = () => {
    setTopupBusy(true)

    scheduleTimeout(() => {
      const amount = Number(topupAmount)

      if (!amount || amount <= 0 || amount > balance) {
        setTimedStatus('topup', setTopupStatus, {
          type: 'fail',
          text: 'FAILED',
        })
        addLog(
          `Airtime FAILED (${network} ${formatRand(Number.isFinite(amount) ? amount : 0)} for ${phoneNumber || 'unknown number'})`,
        )
        setTopupBusy(false)
        return
      }

      setBalance((prev) => prev - amount)
      setTimedStatus('topup', setTopupStatus, {
        type: 'success',
        text: 'SUCCESS',
      })
      addLog(`Airtime SUCCESS (${network} ${formatRand(amount)} for ${phoneNumber})`)
      setTopupBusy(false)
      setTopupAmount('')
      setPhoneNumber('')
    }, LATENCY_MS)
  }

  const handleReset = () => {
    Object.values(statusTimers.current).forEach((timerId) => {
      window.clearTimeout(timerId)
    })
    timeoutPool.current.forEach((timerId) => {
      window.clearTimeout(timerId)
    })
    statusTimers.current = {}
    timeoutPool.current = []

    setIsAuthenticated(false)
    setUsername('')
    setPassword('')
    setLoginBusy(false)
    setLoginStatus(null)
    setBalance(INITIAL_BALANCE)
    setWithdrawAmount('')
    setWithdrawStatus(null)
    setNetwork('Vodacom')
    setTopupAmount('')
    setPhoneNumber('')
    setTopupBusy(false)
    setTopupStatus(null)
    setActivityLogs([])
  }

  return (
    <div className="portal-shell">
      <div className="grid-overlay" />

      {!isAuthenticated ? (
        <main className="login-main">
          <section className="login-pane fade-in-up">
            <div className="login-brand">
              <div className="brand-mark" aria-hidden="true">
                ⚡
              </div>
              <h1>
                The Pulse of <br />
                <span>Your Business.</span>
              </h1>
              <p>Welcome back, Champion. Sign in to your portal.</p>
            </div>

            <section className="login-card fade-in-up delay-1">
              {loginStatus && (
                <p
                  className={getStatusClass(loginStatus.type)}
                  data-testid="login-status"
                  role="status"
                  aria-live="polite"
                >
                  {loginStatus.text}
                </p>
              )}

              <form className="form-stack" onSubmit={handleSignIn}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  data-testid="user-input"
                  type="text"
                  placeholder="flash_user"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  data-testid="pass-input"
                  type="password"
                  placeholder="secure123"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  className="primary"
                  data-testid="login-button"
                  type="submit"
                  disabled={loginBusy}
                >
                  {loginBusy ? 'Verifying...' : 'Sign In'}
                </button>
              </form>

              <div className="promo-strip">
                <strong>New Flash Rewards</strong>
                <span>Earn 2% extra on all airtime sales today.</span>
              </div>
            </section>

            <footer className="login-footer-links">
              <span>Help Center</span>
              <span>Security Terms</span>
              <span>Merchant Portal V2.4</span>
            </footer>
          </section>

          <aside className="login-side-art" aria-hidden="true">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwhrVEmsGts81CLC85MNN-WvzbXRg6VLaiaLLQugCrqsyl6g_uEA20gqjGASAMIR_MTFpqafhXCG1RYtt0EWKyPWilpST_tyRHk0p0bhg_dYedAs3M6WS7PT3Q5zqjTUy05Nr8LUJ8NTPKeKlBp4NQRWvMnK3qaHWI_IPfs_yfm2tb9fgBVfcfZPALvy1oVt3B1Jn6p47jl4pfU8fKVtaqWopnxHsqdLh7N-qZcxWnlKuF9PPqvrKpqq7MBFOddRsZWZkFbBBT2Fs"
              alt=""
            />
          </aside>
        </main>
      ) : (
        <main className="dashboard-shell">
          <aside className="dashboard-side fade-in-up">
            <div className="side-brand">
              <div className="side-bolt">⚡</div>
              <div>
                <h3>The Pulse</h3>
                <p>Merchant Hub</p>
              </div>
            </div>
            <nav>
              <a href="#" onClick={(event) => event.preventDefault()}>
                Dashboard
              </a>
              <a className="active" href="#" onClick={(event) => event.preventDefault()}>
                Wallet
              </a>
              <a href="#" onClick={(event) => event.preventDefault()}>
                Airtime
              </a>
              <a href="#" onClick={(event) => event.preventDefault()}>
                Settings
              </a>
            </nav>
            <button className="primary side-action" type="button">
              Sell Now
            </button>
          </aside>

          <section className="dashboard-main">
            <header className="dashboard-header fade-in-up">
              <p className="header-kicker">Flash Merchant</p>
              <button
                className="ghost"
                data-testid="logout-btn"
                type="button"
                onClick={() => setIsAuthenticated(false)}
              >
                Sign Out
              </button>
            </header>

            <div className="hero-grid">
              <section className="balance-card fade-in-up delay-1">
                <p>Current Balance</p>
                <h3 data-testid="balance-display">{formatRand(balance)}</h3>
                <small>Daily withdrawal limit: {formatRand(WITHDRAW_LIMIT)}</small>
              </section>

              <section className="promo-card fade-in-up delay-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDncJ1DWSSkWmVXkPbQqciMAp0r0QASkohr9r0vzRGmG47QlxLsebgA7Hj7Upyql24MusA1L9b9BmSStpvpNiTAcdssKfH97dlTfF4CenEYpgMLChcPZiu7-lQyyo3-gdIyTbjEV_ShHQ3udnKz36WwG5ISss_wc1h_PQq6zSBO33jJnCpjNHtcq1CDFS6HWYsIBGdyuqc1j3WxeGjwtLR3j2swjXw8tD4Glcs4GkvO3Q9_tI-OnN_UsGEnOMKjs6xnJNPhank28rU"
                  alt=""
                />
                <div>
                  <h4>The Trader&apos;s Champion</h4>
                  <p>
                    Empower your community with Flash. Sell airtime, data, and
                    electricity with ease and earn instant rewards.
                  </p>
                </div>
              </section>
            </div>

            <section className="labs-grid">
              <article className="lab-card fade-in-up delay-2">
                <h4>Wallet Withdrawal Lab</h4>
                <label htmlFor="withdraw-amount">Withdrawal Amount</label>
                <input
                  id="withdraw-amount"
                  data-testid="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                />
                <button
                  className="primary"
                  data-testid="withdraw-btn"
                  type="button"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </button>

                {withdrawStatus && (
                  <p
                    className={getStatusClass(withdrawStatus.type)}
                    data-testid="transaction-status"
                    role="status"
                    aria-live="polite"
                  >
                    {withdrawStatus.text}
                  </p>
                )}
              </article>

              <article className="lab-card fade-in-up delay-3">
                <h4>Airtime Top-up Lab</h4>
                <label htmlFor="network">Network</label>
                <select
                  id="network"
                  data-testid="network-select"
                  value={network}
                  onChange={(event) => setNetwork(event.target.value)}
                >
                  <option value="Vodacom">Vodacom</option>
                  <option value="MTN">MTN</option>
                  <option value="Cell C">Cell C</option>
                </select>

                <label htmlFor="topup-amount">Top-up Amount</label>
                <input
                  id="topup-amount"
                  data-testid="topup-amount"
                  type="number"
                  placeholder="20.00"
                  value={topupAmount}
                  onChange={(event) => setTopupAmount(event.target.value)}
                />

                <label htmlFor="phone-number">Phone Number</label>
                <input
                  id="phone-number"
                  data-testid="phone-number"
                  type="tel"
                  placeholder="0812345678"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />

                <button
                  className="secondary"
                  data-testid="purchase-btn"
                  type="button"
                  onClick={handlePurchase}
                  disabled={topupBusy}
                >
                  {topupBusy ? 'Processing...' : 'Purchase Airtime'}
                </button>

                {topupStatus && (
                  <p
                    className={getStatusClass(topupStatus.type)}
                    data-testid="topup-status"
                    role="status"
                    aria-live="polite"
                  >
                    {topupStatus.text}
                  </p>
                )}
              </article>
            </section>

            <section className="log-card fade-in-up delay-3">
              <h4>Activity Log</h4>
              <ul data-testid="activity-log">
                {activityLogs.length === 0 ? (
                  <li className="empty">No activity yet.</li>
                ) : (
                  activityLogs.map((entry) => (
                    <li key={entry.id}>
                      <span>{entry.stamp}</span>
                      <strong>{entry.message}</strong>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </section>
        </main>
      )}

      <footer className="portal-footer">
        <button
          className="ghost"
          data-testid="reset-portal-btn"
          type="button"
          onClick={handleReset}
        >
          Reset Portal
        </button>
      </footer>
    </div>
  )
}

export default App
