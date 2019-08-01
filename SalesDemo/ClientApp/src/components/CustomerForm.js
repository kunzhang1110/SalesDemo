import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';

export class CustomerForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            customer: {
                name: "",
                address: ""
            },
            IsEdit: false
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {
        if (this.props.customer != null) {
            this.state.customer = this.props.customer;
            this.state.IsEdit = true;
        }
        this.state.originalCustomer = this.props.customer; 


        //if (this.props.match.params.id) {
        //    const resp = await fetch("/api/Customer/" + this.props.match.params.id);
        //    const json = await resp.json();
        //    this.setState({ customer: json });
        //}
    }
    cancelHandler =() => {
        this.setState({ customer: this.state.originalCustomer })
        this.handleClose();
    }

    submitHandler = (e) => {
        axios.post('/api/Customer', {
            name: this.state.customer.name,
            address: this.state.customer.address
        }).then((res) => {
            console.log(res);
            this.handleClose();
        })
    }

    changeHandler = (e, { name, value }) => {
        console.log(this.state)
        this.setState({ customer: { ...this.state.customer, [name]: value } })
    }
    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen}>{(this.props.customer == null) ? "New Customer" : "Edit"}</Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>Create Customer</Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <Header></Header>
                        <Form onSubmit={this.submitHandler}>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input placeholder='Jone'
                                    name="name"
                                    value={this.state.customer.name} 
                                    onChange={this.changeHandler}/>
                             
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <Form.Input placeholder='Boxhill'
                                    name="address"
                                    value={this.state.customer.address}
                                    onChange={this.changeHandler} />
                            </Form.Field>
                            <Button type='submit' color="green">Submit</Button>
                            <Button onClick={this.cancelHandler}>Cancel</Button>
                        </Form>

                    </Modal.Description>

                </Modal.Content>

            </Modal>
        );
    }
}

CustomerForm.propTypes = {
    customer: PropTypes.object
}