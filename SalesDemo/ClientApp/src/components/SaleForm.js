import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react'
import axios from 'axios';
import { Capitalize, formatDateToString } from "../utils"

export class SaleForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            item: Object.assign({},props.item),
        }
        if (this.props.isEdit == false) {
            this.state.item.dateSold = formatDateToString(new Date());//default current date
        } else {
            this.state.item.dateSold = formatDateToString(new Date(this.state.item.dateSold));//default current date
        }
    }


    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    cancelHandler = () => {
            this.setState({ item: this.props.item, modalOpen: false });
    }

    submitHandler = () => {

        if (this.props.isEdit) {//if editing
            axios.put('/api/' + this.props.model + '/' + this.state.item.id, this.state.item).then((res) => {
                this.handleClose();
                this.props.editHandler(this.state.item);
            })
        } else {//if creating
            const { id, ...data } = this.state.item;
            axios.post('/api/' + this.props.model, data).then((res) => {
                this.handleClose();
                this.props.createHandler(res.data);
                this.setItemToEmpty();
            })
        }
    }

    changeHandler = (e, { name, value }) => {
        this.setState({ item: { ...this.state.item, [name]: value } })
    }

    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen}> {(this.props.isEdit) ? "Edit" : "New " + this.props.model} </Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>{((this.props.isEdit) ? "Edit " : "Create ") + this.props.model}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.submitHandler}>
                            <Form.Field>
                                <label>Date Sold</label>
                                <Form.Input
                                    name="dateSold"
                                    value={this.state.item["dateSold"]}
                                    onChange={this.changeHandler} />
                            </Form.Field>
                            <Form.Field>
                                <label>Customer</label>
                                <Dropdown
                                    placeholder='--Select--'
                                    fluid
                                    search
                                    selection
                                    name="customerId"
                                    onChange={this.changeHandler}
                                    options={this.props.customerOptions}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Product</label>
                                <Dropdown
                                    placeholder='--Select--'
                                    name="productId"
                                    fluid
                                    search
                                    selection
                                    onChange={this.changeHandler}
                                    options={this.props.productOptions}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Store</label>
                                <Dropdown
                                    placeholder='--Select--'
                                    name="storeId"
                                    fluid
                                    search
                                    selection
                                    onChange={this.changeHandler}
                                    options={this.props.storeOptions}
                                />
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

SaleForm.propTypes = {
    item: PropTypes.object,
    editHandler: PropTypes.func,
    isEdit: PropTypes.bool,
    model: PropTypes.string
}