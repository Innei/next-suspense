import { wrapperNextPage } from 'next-suspense/esm'

export const wrapper: typeof wrapperNextPage = (NextPage, options) =>
  wrapperNextPage(NextPage, {
    ErrorComponent: (props) => <div>Error: {JSON.stringify(props.error)}</div>,
    LoadingComponent: () => <div>Loading...</div>,
    ...options,
  })
