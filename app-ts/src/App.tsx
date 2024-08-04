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
import Drafts from './pages/Drafts';
import Notifications from './pages/Notifications';
import PrivateShelf from './pages/PrivateShelf';

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
import Editor from './pages/Editor';
import TestPage from './pages/TestPage';
import Settings from './pages/Settings';
import Preview from './pages/Preview';


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
      <div className="App">
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>

            <RainbowKitProvider>
                {/* Routes */}
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/view/:tbsn" element={<TBookPub />} />
                    <Route path="/error" element={<Error404 />} />
                    <Route path="/dashboard" element={<Notifications />} />
                    <Route path="*" element={<Navigate to="/error" />} />
                    <Route path="/collections" element={<PrivateShelf />} />
                    <Route path="/drafts" element={<Drafts />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/preview" element={<Preview />} />
            
                  </Routes>
                </BrowserRouter>

              </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
      </div>
    );
  }
}

export default App;