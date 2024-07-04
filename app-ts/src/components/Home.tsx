import Poster from './Poster';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


// https://www.rainbowkit.com/docs/installation

const Home: React.FC = () => {
    return (
        <div>
            <ConnectButton />
            {/* Add your content here */}
            <Poster />
        </div>
    );
}

export default Home;