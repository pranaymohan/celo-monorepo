import * as React from 'react'

export default function Link({ children, prefetch, href }) {
  return <a href={href}>{children}</a>
}
