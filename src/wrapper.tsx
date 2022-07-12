import type { NextPage, NextPageContext } from 'next'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import React, { memo, useEffect, useState } from 'react'

import { Noop } from './components'
import { isClientSide } from './utils'

const createMockContext = (router: NextRouter): NextPageContext => {
  return {
    AppTree: () => null,
    pathname: router.pathname,
    query: router.query,
    asPath: router.asPath,
  }
}

export type WrapperOptions = {
  ErrorComponent?: (props: { error?: any }) => JSX.Element | null
  LoadingComponent?: () => JSX.Element | null
}
// only use once getInitialProps result from server fetch, because it will be reset after each fetch and fetch in csr.
let useServerPropsOnce = false
export function wrapperNextPage<P extends {}>(
  NextPage: NextPage<P>,
  options: WrapperOptions = {},
) {
  if (!isClientSide()) {
    return NextPage
  }

  const { LoadingComponent = Noop, ErrorComponent = Noop } =
    options as Required<WrapperOptions>

  const Page: NextPage<any> = memo((props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(
      NextPage.getInitialProps ? true : false,
    )

    const [dataProps, setProps] = useState(!useServerPropsOnce ? props : null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
      if (!NextPage.getInitialProps) {
        useServerPropsOnce = true
        setLoading(false)
        return
      }

      if (!useServerPropsOnce) {
        useServerPropsOnce = true
        setLoading(false)
        return
      }

      try {
        const task = NextPage.getInitialProps(createMockContext(router))
        const isPromise = 'then' in task
        if (isPromise) {
          task
            .then((data: any) => {
              setLoading(false)
              setProps(data)
            })
            .catch((err: any) => {
              setLoading(false)
              setError(err)
            })
        } else {
          setLoading(false)
          setProps(task)
        }
      } catch (err: any) {
        setLoading(false)
        setError(err)
      }
      // NOTE: if asPath change, re-fetch data but not set loading to `true`!!
    }, [router.asPath])

    if (error) {
      return <ErrorComponent error={error} />
    }

    if (!dataProps && loading) {
      return <LoadingComponent />
    }

    // @ts-ignore
    return <NextPage {...dataProps} />
  })

  return Page as NextPage<P>
}
