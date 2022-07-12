# Next Suspense

A suspense wrapper for NextJS when change router and fetching data in CSR.

## Movement

As we know, Next will fetching data in router change, and waiting for request finished then render the next page.

We hope only use blocked fetch data (aka. `getInitialProps`) for first screen of my app because of SSR. And when changing pages (in CSR), it can work as a SPA that will responsive user interactive immediately.

```
CSR: Page A == router change ==> Render Loading Component ==> router done
                               at the same time
                             ==> Fetch data  ==> Render Page B
```

When the Next Router change, and next page has `getInitialProps` method that needed to called. We suspenses it, and render Loading Component immediately and fetching data at the same time. After fetching data successfully, then render Page B.

## Install

```
npm i next-suspense
```

## Usage

```tsx
// utils/wrapper.tsx
import { wrapperNextPage } from 'next-suspense/esm'

export const wrapper: typeof wrapperNextPage = (NextPage, options) =>
  wrapperNextPage(NextPage, {
    ErrorComponent: (props) => <div>Error: {JSON.stringify(props.error)}</div>,
    LoadingComponent: () => <div>Loading...</div>,
    ...options,
  })

// pages/with-request.tsx
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

```

## License

MIT. Innei, Coding with love.