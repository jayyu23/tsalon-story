import Navbar from '../components/Navbar';
import Poster from '../components/Poster';
import TBookStore from '../components/TBookstore';

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Poster />
            <div id="store">
            <TBookStore />
            </div>
        </div>
    );
}

export default Home;