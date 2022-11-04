import React from 'react'
import { HomePage } from './home-page'
import { screen, act, render } from '@testing-library/react'

const makeSut = (): void => {
  render(<HomePage />)
}

describe('Home Page', () => {
  test('Should render correct title', async () => {
    await act(async () => {
      makeSut()
    })
    const title = screen.getByTestId('home-page-title')
    expect(title.textContent).toBe('React Skeleton')
  })
})
