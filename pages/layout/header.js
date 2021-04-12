import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import ApiService from "../../utils/api";

const apiService = new ApiService();
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Header = (props) => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Мэдээллийн сан</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#link">Хэрэглэгч</Nav.Link>
            <Nav.Link href="#home">Салбарууд</Nav.Link>
            <Nav.Link href="#link">Тоо Баримт</Nav.Link>
            
          </Nav>
          <Form inline>
            <Button variant="outline-success">Гарах</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
