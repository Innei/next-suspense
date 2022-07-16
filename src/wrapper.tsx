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

export function wrapperNextPage<P extends {}>(
  NextPage: NextPage<P>,
  options: WrapperOptions = {},
) {
  if (!isClientSide()) {
    const originalGetInitialProps = NextPage.getInitialProps
    if (originalGetInitialProps) {
      NextPage.getInitialProps = async (ctx: NextPageContext) => {
        return {
          ...(await originalGetInitialProps(ctx)),
          __$$path: ctx.asPath,
        }
      }
    }

    return NextPage
  }
  const { LoadingComponent = Noop, ErrorComponent = Noop } =
    options as Required<WrapperOptions>

  const Page: NextPage<any> = memo((props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(
      NextPage.getInitialProps ? true : false,
    )

    const [dataProps, setProps] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
      if (!NextPage.getInitialProps) {
        setLoading(false)
        setProps(null)

        return
      }

      if (props.__$$path === router.asPath) {
        setLoading(false)
        setProps(props)
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
