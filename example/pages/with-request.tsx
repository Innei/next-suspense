import type { NextPage } from 'next'
import React from 'react'
import { sleep } from 'utils'
import { wrapper } from 'utils/wrapper'

const IndexPage: NextPage<{
  bio: string
}> = (props) => {
  return (
    <div>
      <p>Hello Next.js</p>

      <p>{props.bio}</p>
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
