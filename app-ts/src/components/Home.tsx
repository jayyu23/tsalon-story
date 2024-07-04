import Navbar from './Navbar';
import Poster from './Poster';
import TBookStore from './TBookstore';


// https://www.rainbowkit.com/docs/installation

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Poster />
            <TBookStore />
        </div>
    );
}

export default Home;