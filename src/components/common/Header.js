import React, { useState, useEffect } from 'react';
import { Header as StyledHeader } from './../../styles';
import { Link, useHistory } from 'react-router-dom';

import { loadState } from '../../helpers/LocalStorage';
import { DEFAULT_LOCATION } from '../../common/consts';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
function Header({ heading, backPath }) {
  const history = useHistory();
  const [displayLogout, setDisplayLogout] = useState(false);
  const { resetLocation, resetStoreSlotId } = useLocationAndStoreContext();
  function logOut() {
    localStorage.clear();
    resetLocation();
    resetStoreSlotId();
    history.push('/');
  }

  useEffect(() => {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;
    if (token) {
      setDisplayLogout(true);
    } else {
      setDisplayLogout(false);
    }
  }, []);
  return (
    <StyledHeader>
      <Link to={backPath}>
        <span className="material-icons">arrow_back</span>
      </Link>

      <h2 className="text-center">{heading}</h2>
      {displayLogout ? (
        <a href="#" className="logout" onClick={logOut}>
          Logout
        </a>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </StyledHeader>
  );
}

export default Header;
