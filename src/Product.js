import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const BASE_URL = 'http://localhost:8081/product';

const Product = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [desc, setDesc] = useState('');
    const [pid, setPid] = useState('');
    const [mode, setMode] = useState('Add');
    const [productList, setProductList] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteEvent, setDeleteEvent] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        setShow(true);
        setDeleteEvent(e);
    }

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAll`)
            if (response.status === 200) {
                setProductList(response.data);
            }
        } catch (error) {
            setProductList([])
        }

    }

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        setName('');
        setPrice(0);
        setDesc('');
        setPid('');
    }, [mode])

    const changeHandler = (e) => {
        const id = e.target.id;
        const val = e.target.value;
        switch (id) {
            case "name":
                setName(val);
                break;
            case "price":
                setPrice(val.replace(/\D/g, ""));
                break;
            case "desc":
                setDesc(val);
                break;
            default:
                break;
        }
    }

    const getProduct = async (pid) => {
        try {
            const response = await axios.get(`${BASE_URL}/get/${pid}`);
            if (response.status === 200) {
                setName(response.data.name);
                setPrice(response.data.price);
                setDesc(response.data.description);
            } else {
                toast.info('Product not found');
            }
        } catch (error) {
            console.log(error);
            toast.info('Product not found');
        }

    }

    const reset = () => {
        setName('');
        setPrice(0);
        setDesc('');
        setPid('');
        setMode('Add');
    }

    const submitHandler = () => {
        const isValid = (name !== '' && name?.trim().length > 0) && (price > 0 && price !== '') && (desc !== '' && desc?.trim().length > 0);
        if (isValid) {
            const product = {
                name: name.trim(),
                price: price,
                description: desc.trim()
            }
            const url = mode === 'Update' ? `${BASE_URL}/update/${pid}` : `${BASE_URL}/create`
            axios.post(url, product)
                .then(() => {
                    toast.success(`Product ${mode === 'Update' ? 'updated' : 'added'} successfully`);
                    getProducts();
                    reset();
                })
                .catch((error) => {
                    if (error?.response?.status === 418) {
                        toast.info(error.response.data);
                        reset();
                    } else {
                        console.log(error);
                        toast.error(`Failed to ${mode === 'Update' ? 'update' : 'add'} product`);
                    }
                });
        } else {
            if (name.trim() === '') {
                toast.error("Enter Name");
            } else if (price === 0) {
                toast.error("Enter Price");
            } else if (desc.trim() === '') {
                toast.error("Enter Description");
            }
        }
    }

    const getId = async (e) => {
        const curr = e.target.parentNode.parentNode.innerText.split("\t");
        const product = {
            name: curr[1],
            price: curr[2],
            description: curr[3]
        }
        const response = await axios.post(`${BASE_URL}/getId`, product);
        return response.data;
    }

    const updateProduct = async (e) => {
        setMode('Update');
        const pid = await getId(e);
        setPid(pid);
        getProduct(pid);
    }

    const deleteProduct = async (e) => {
        handleClose();
        const pid = await getId(e);
        try {
            const response = await axios.get(`${BASE_URL}/delete/${pid}`);
            if (response.status === 200) {
                toast.success("Product deleted successfully");
                getProducts();
                setDeleteEvent(null);
                reset();
            } else {
                toast.error("Failed to delete Product");
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>
            <h3 style={{ marginLeft: '10px' }}>{mode} Product</h3>

            <Form style={{ marginLeft: '25px' }}>
                <Form.Group className="col-sm-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" id="name" value={name} onChange={changeHandler} />
                </Form.Group>

                <Form.Group className="col-sm-2">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control type="text" id="price" value={price} onChange={changeHandler} />
                </Form.Group>

                <Form.Group className="col-sm-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" id="desc" value={desc} onChange={changeHandler} />
                </Form.Group>
                {mode === 'Update' && <Button variant="secondary" id="cancel" onClick={() => setMode('Add')} style={{ margin: '20px' }}>
                    Cancel
                </Button>}
                <Button variant="primary" id="submitProduct" onClick={submitHandler} style={{ margin: '20px' }}>
                    {mode}
                </Button>
            </Form>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Do you want to delete this Product?<br />
                    {deleteEvent && deleteEvent.target.parentNode.parentNode.innerText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => deleteProduct(deleteEvent)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Price ₹</th>
                        <th>Description</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productList.length > 0 && productList.map((product, i) =>
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.description}</td>
                                <td>
                                    <Button variant="secondary" id="getPid" onClick={updateProduct}></Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={handleShow}></Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default Product;