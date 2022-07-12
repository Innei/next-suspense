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
      <p>With Fetching data</p>

      <p>Fetched Data:</p>
      <pre>{JSON.stringify(props.bio, null, 2)}</pre>

      <br />

      <Link href={'/with-request'}>
        <a>Go to with-request page</a>
      </Link>
      <br />

      <Link href={'/with-request-error'}>
        <a>Go to with-request-error page</a>
      </Link>
    </div>
  )
}

IndexPage.getInitialProps = async () => {
  await sleep(1000)
  return {
    bio: 'bio from fetched request',
  }
}

export default wrapper(IndexPage)
