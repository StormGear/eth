'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains'; // add baseSepolia for testing 
 
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY} 
      projectId={import.meta.env.VITE_PROJECT_ID}
      chain={base} // add baseSepolia for testing 
      config={{
        appearance: {
          name: 'eth',        // Displayed in modal header
          logo: 'https://cdn.pixabay.com/photo/2021/05/24/09/15/ethereum-logo-6278329_1280.png',// Displayed in modal header
          mode: 'auto',                 // 'light' | 'dark' | 'auto'
          theme: 'default',             // 'default' or custom theme
        },
        wallet: { 
          display: 'modal', 
          termsUrl: 'https://...', 
          privacyUrl: 'https://...', 
          },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}