/**
 * The main component of the TSalon application.
 * Renders the application routes and providers.
 */
import { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import Pages
import Home from './pages/Home';
import Error404 from './pages/Error404';
import TBookPub from './pages/TBookPub';
import UserHome from './pages/UserHome';

// Import Wagmi
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import {
  sepolia,
} from 'wagmi/chains';


const config = getDefaultConfig({
  appName: 'TSalon',
  projectId: '59b6c756cd5cd9178b50d3bf8329bb43',
  chains: [sepolia],
  ssr: true, // server side rendering (SSR)
});


const queryClient = new QueryClient();

class App extends Component {
  /**
   * Renders the TSalon application.
   * @returns The TSX element representing the TSalon application.
   */
  render() {
    return (
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
              {/* Routes */}
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/view/:tbsn" element={<TBookPub />} />
                  <Route path="/error" element={<Error404 />} />
                  <Route path="/dashboard" element={<UserHome />} />
                  <Route path="*" element={<Navigate to="/error" />} />
                  
                </Routes>
              </BrowserRouter>

            </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
    );
  }
}

export default App;