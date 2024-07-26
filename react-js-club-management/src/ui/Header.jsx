import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  justify-content: space-between;
`;

function Header() {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/Signup");
  }

  const user = auth ? JSON.parse(auth) : null;

  console.log(user.fullName);
  return (
    <StyledHeader>
      HEADER
      {user ? (
        <Link onClick={logout} to="/login">
          Logout ({user.fullName})
        </Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </StyledHeader>
  );
}

export default Header;
