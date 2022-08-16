# Next Suspense

A suspense wrapper for NextJS to use when the route changes and data is being fetched with CSR.

## Motivation

As we know, in NextJS it's possible to fetch data when the route changes, to then wait for the finished request before rendering the page.

The goal of this library is to use SSR (with `getInitialProps`) to fetch the initial data needed in the first loaded screen, and use CSR (client-side rendering) when changing routes afterwards, so that the user interface responds immediately and shows a Loading-component until the data needed is fetched.

```
                               ,--> render loading component  ->  ,---> rerender when data fetched
                              /                                  /
Initial page -> route changes            (in meanwhile)         /
(CSR)                         \                                /
                               `-------->   fetch data   -----´
```
When the Next-router navigates towards another route and the Next-page has a `getInitialProps`-method, we use a Suspense-mechanism to immediately render a loading-component as a fallback, while data is being fetched on the background. When the fetching has completed, the loading-component is swapped out by the requested page in a rerender.

## Install

```
npm i next-suspense
```
or
```
yarn add next-suspense
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
