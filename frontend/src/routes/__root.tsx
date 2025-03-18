import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const token = localStorage.getItem('token')
  if (!token && window.location.pathname !== "/") {
    window.location.href = "/"
    return null
  }
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
