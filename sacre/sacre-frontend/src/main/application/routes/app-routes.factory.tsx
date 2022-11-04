import React, { useMemo } from 'react'
import { GlobalStyle } from '@/presentation/common/style'
import { RouteProps, BrowserRouter, Switch } from 'react-router-dom'
import { Route } from 'react-router'
import { InitialRoutesConstants } from '@/main/inicial/routes'

export const AppRoutesFactory: React.FC = () => {
  const routes: RouteProps[] = [...InitialRoutesConstants]

  const handleRoutes = useMemo(() => {
    return (
      <>
        {routes.map((route, index) => {
          return (<Route key={`${route.path.toString()}-${index}`} path={route.path} exact={route.exact} component={route.component}/>)
        })}
      </>
    )
  }, [])

  return (
    <>
      <GlobalStyle/>
      <BrowserRouter>
        <Switch>
          {handleRoutes}
        </Switch>
      </BrowserRouter>
    </>
  )
}
