'use client'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'

const HelmetProviders = ({children}) => {
  return (
    <>
    <HelmetProvider>
        {children}
    </HelmetProvider>
    </>
  )
}

export default HelmetProviders