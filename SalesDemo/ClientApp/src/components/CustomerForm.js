import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';

export class CustomerForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            isEdit: (this.props.customer != null) ? true:false,
            customer: (this.props.customer != null) ? this.props.customer:{ name: "", adress: "" }
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {

    }

    cancelHandler = () => {
        this.setState({ customer: this.props.customer, modalOpen: false });
    }

    submitHandler = (e) => {
        if (this.state.isEdit) {//if editing
            axios.put('/api/Customer/' + this.state.customer.id, {
                name: this.state.customer.name,
                address: this.state.customer.address
            }).then((res) => {
                this.handleClose();
                this.props.editHandler(this.state.customer);
            })
        } else {//if creating
            axios.post('/api/Customer', {
                name: this.state.customer.name,
                address: this.state.customer.address
            }).then((res) => {

                this.handleClose();
                this.props.createHandler(res.data);
            })
        }
    }

    changeHandler = (e, { name, value }) => {
        this.setState({ customer: { ...this.state.customer, [name]: value } })
    }

    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen}> {(this.state.isEdit) ?"Edit": "New Customer" } </Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>{(this.state.isEdit) ? "Edit Customer" : "Create Customer"}</Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <Header></Header>
                        <Form onSubmit={this.submitHandler}>
                            <Form.Field>
                                <label>Name</label>
                                <Form.Input
                                    placeholder='Jone'
                                    name="name"
                                    value={this.state.customer.name}
                                    onChange={this.changeHandler} />

                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <Form.Input
                                    placeholder='Boxhill'
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
    customer: PropTypes.object,
    editHandler: PropTypes.func
}