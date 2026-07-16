import NavBar from "../components/NavBar.jsx";
import HomeBanner from "../components/HomeBanner.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import Footer from "../components/Footer.jsx";

const Home = () =>{

    return (
        <div>
            <NavBar/>
            <HomeBanner/>
            <RecipeCard type={'Drinks'} />
            <RecipeCard type={'Soup'} />
            <Footer/>
        </div>
    );
}

export default Home;