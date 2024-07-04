import Poster from './Poster';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

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