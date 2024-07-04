import { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  sepolia,
} from 'wagmi/chains';

import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'TSalon',
  projectId: '59b6c756cd5cd9178b50d3bf8329bb43',
  chains: [mainnet, sepolia, polygon],
  ssr: true, // server side rendering (SSR)
});

const queryClient = new QueryClient();

class App extends Component {
  render() {
    return (
      <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
              {/* Routes */}
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
              </BrowserRouter>

            </RainbowKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
    );
  }
}

export default App;