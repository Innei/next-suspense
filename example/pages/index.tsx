import type { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { wrapper } from 'utils/wrapper'

const IndexPage: NextPage = () => {
  return (
    <div>
      <p>Hello Next.js</p>
      <Link href={'/with-request'}>
        <a>Go to with-request page</a>
      </Link>
    </div>
  )
}

export default wrapper(IndexPage)
