import type { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { sleep } from 'utils'
import { wrapper } from 'utils/wrapper'

const IndexPage: NextPage<{
  bio: string
}> = (props) => {
  return (
    <div>
      <p>With Error</p>
    </div>
  )
}

IndexPage.getInitialProps = async () => {
  await sleep(100)
  throw new RequestError()
}

export default wrapper(IndexPage, {
  ErrorComponent(props) {
    const { error } = props

    return (
      <div>
        Code: {error.code}
        <br />
        Message: {error.message}
        <p>
          <Link href={'/with-request'}>
            <a>Go to with-request page</a>
          </Link>
          <br />
          <Link href={'/with-request-error'}>
            <a>Go to with-request-error page</a>
          </Link>
        </p>
      </div>
    )
  },
})

class RequestError extends Error {
  constructor() {
    super('Request Error')
  }

  public get code() {
    return 404
  }

  public message = 'Not Found'
}
