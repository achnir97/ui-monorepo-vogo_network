import React from "react"
import { init as initSentry, ErrorBoundary } from "@sentry/react"
import { Web3Provider } from "@chainsafe/web3-context"
import { ThemeSwitcher } from "@chainsafe/common-theme"
import "@chainsafe/common-theme/dist/font-faces.css"
import { CssBaseline, Router, ToastProvider } from "@chainsafe/common-components"
import StorageRoutes from "./Components/StorageRoutes"
import AppWrapper from "./Components/Layouts/AppWrapper"
import { LanguageProvider } from "./Contexts/LanguageContext"
import { lightTheme } from "./Themes/LightTheme"
import { darkTheme } from "./Themes/DarkTheme"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { StorageApiProvider }  from "./Contexts/StorageApiContext"
import { StorageProvider } from "./Contexts/StorageContext"
import { UserProvider } from "./Contexts/UserContext"
import { BillingProvider } from "./Contexts/BillingContext"
import { NotificationsProvider } from "./Contexts/NotificationsContext"
import { PosthogProvider } from "./Contexts/PosthogContext"
import { HelmetProvider } from "react-helmet-async"
import ErrorModal from "./Components/Modules/ErrorModal"
import { StylesProvider, createGenerateClassName } from "@material-ui/styles"

// making material and jss use one className generator
const generateClassName = createGenerateClassName({
  productionPrefix: "c",
  disableGlobal: true
})

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL
) {
  initSentry({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: process.env.REACT_APP_SENTRY_ENV
  })
}

const availableLanguages = [
  { id: "en", label: "English" }
]

const onboardConfig = {
  dappId: process.env.REACT_APP_BLOCKNATIVE_ID || "",
  walletSelect: {
    wallets: [
      { walletName: "coinbase" },
      {
        walletName: "trust",
        rpcUrl:
          "https://mainnet.infura.io/v3/a7e16429d2254d488d396710084e2cd3"
      },
      { walletName: "metamask", preferred: true },
      { walletName: "authereum" },
      { walletName: "opera" },
      { walletName: "operaTouch" },
      { walletName: "torus" },
      { walletName: "status" },
      {
        walletName: "walletConnect",
        infuraKey: "a7e16429d2254d488d396710084e2cd3",
        preferred: true
      },
      { walletName: "detectedwallet" }
    ]
  }
}

const App = () => {
  const { canUseLocalStorage } = useLocalStorage()
  const apiUrl = process.env.REACT_APP_API_URL || "https://stage-api.chainsafe.io/api/v1"
  // This will default to testnet unless mainnet is specifically set in the ENV

  return (
    <HelmetProvider>
      <StylesProvider generateClassName={generateClassName}>
        <ThemeSwitcher
          storageKey="css.themeKey"
          themes={{ light: lightTheme, dark: darkTheme }}
        >
          <ErrorBoundary
            fallback={ErrorModal}
            onReset={() => window.location.reload()}
          >
            <CssBaseline />
            <LanguageProvider availableLanguages={availableLanguages}>
              <ToastProvider
                autoDismiss
                defaultPosition="bottomRight">
                <Web3Provider
                  onboardConfig={onboardConfig}
                  checkNetwork={false}
                  cacheWalletSelection={canUseLocalStorage}
                >
                  <StorageApiProvider
                    apiUrl={apiUrl}
                    withLocalStorage={true}
                  >
                    <UserProvider>
                      <StorageProvider>
                        <Router>
                          <NotificationsProvider>
                            <BillingProvider>
                              <PosthogProvider>
                                <AppWrapper>
                                  <StorageRoutes />
                                </AppWrapper>
                              </PosthogProvider>
                            </BillingProvider>
                          </NotificationsProvider>
                        </Router>
                      </StorageProvider>
                    </UserProvider>
                  </StorageApiProvider>
                </Web3Provider>
              </ToastProvider>
            </LanguageProvider>
          </ErrorBoundary>
        </ThemeSwitcher>
      </StylesProvider>
    </HelmetProvider>
  )
}

export default App
