import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Inventory from './Inventory';
import Order from './Order';
import Product from './Product';

const App = () => {

  const [currentComponent, setCurrentComponent] = useState('product');

  const clickHandler = (e) => {
    setCurrentComponent(e.target.id);
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">HK</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#product" id='product' onClick={clickHandler}>Product</Nav.Link>
              <Nav.Link href="#order" id='order' onClick={clickHandler}>Order</Nav.Link>
              <Nav.Link href="#inventory" id='inventory' onClick={clickHandler}>Inventory</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {currentComponent === 'product' && <Product />}
      {currentComponent === 'order' && <Order />}
      {currentComponent === 'inventory' && <Inventory />}
      <ToastContainer />
    </div>
  );
}

export default App;