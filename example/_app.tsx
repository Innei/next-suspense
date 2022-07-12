import { useRouterEvent } from 'hooks/use-router-event'

const App = ({ Component, pageProps }) => {
  useRouterEvent()
  return <Component {...pageProps} />
}
export default App
