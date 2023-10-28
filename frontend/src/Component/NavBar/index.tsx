import { NavLink } from 'react-router-dom'


const NavBar = () => {

    const navLink_padding = "p-5";

    const navLink_active= "text-cyan-100 " + navLink_padding;
    const navLink_nonActive = "text-cyan-600 " + navLink_padding;


    return (
        <div className={'bg-cyan-900 flex justify-center p-2 w-full '}>
            <nav className={'p-5'}>
                <NavLink to="/" className={({isActive}) => (isActive ? navLink_active : navLink_nonActive)}>
                    Home
                </NavLink>
                <NavLink to="/tree" className={({isActive}) => (isActive ? navLink_active : navLink_nonActive)}>
                    Tree
                </NavLink>
            </nav>
        </div>
    )
}

export default NavBar;

