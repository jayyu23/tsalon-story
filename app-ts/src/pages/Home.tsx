import Navbar from '../components/Navbar';
import Poster from '../components/Poster';
import TBookStore from '../components/TBookstore';

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