import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/config.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/usersSlice.js';

function Header({ pageTitle }) {
  const dispatch = useDispatch();

  function handleSignout(e){
    e.preventDefault();
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut(auth)
        .then(() => {
          dispatch(setUser(null));
          alert("You have been signed out");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  return (
    <>

      <h1>{pageTitle}</h1>

      <div className="header-btns">

        <NavLink to="/">
          <button className="btn">
            Books teste deploy
          </button>
        </NavLink>

        <NavLink to="/add-book">
          <button className="btn">
            Add Book +
          </button>
        </NavLink>

        <button onClick={(e) => handleSignout(e) } className="btn transparent">
          Logout
        </button>


      </div>

    </>
  )
}

export default Header
