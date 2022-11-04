import { RouteProps } from 'react-router-dom'
import {
  HomePageFactory
} from '@/main/inicial/pages'

export const InitialRoutesConstants: RouteProps[] = [
  { path: '/home', component: HomePageFactory }
]
