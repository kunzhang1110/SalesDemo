import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Dropdown, Label } from 'semantic-ui-react'
import axios from 'axios';
import {  Capitalize, formatDateToString } from "../utils"

export class SaleForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            item: Object.assign({}, props.item),
            errors: {}
        }

    } 

    setItemToEmpty() {
        var item = {};
        Object.keys(this.state.item).map(key => {
            if (key === "dateSold") {
                item[key] = formatDateToString(new Date());//default current date
            }
            else {
                item[key] = "";
            }
        });
        this.setState({ item: item, modalOpen: false});
    }

    componentDidMount() {
        if (this.props.isEdit == false) {
            this.setItemToEmpty();
        }
        else {
            this.setState({
                item: {
                    ...this.state.item,
                    dateSold: formatDateToString(new Date(this.state.item.dateSold))
                }
            })
        }
    }

    validate = () => {
        const errors = {};
     
        Object.keys(this.state.item).map(key => {
            if (key === "dateSold" || key === "customerId" || key === "productId" || key === "storeId"  ) {
                if (this.state.item[key].trim() === "") {
                    let fieldname = Capitalize(key.replace(/Id$/, x => "")); //remove xxxId's Id part from field name
                    errors[key] = `${fieldname} is required.`;
                }
            }
        })
        return Object.keys(errors).length === 0 ? null : errors;

    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    cancelHandler = () => {
        if (this.props.isEdit===false) {
            this.setItemToEmpty();

        } else {
            this.setState({ item: this.props.item, modalOpen: false });
        }
    }

    submitHandler = () => {
        let errors = this.validate();
        if (errors) {
            this.setState({ errors })
            return;
        }


        const { customer, product, store, ...data } = this.state.item;
        if (this.props.isEdit) {//if editing
            axios.put('/api/' + this.props.model + '/' + this.state.item.id, data).then((res) => {
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
                                    error={this.state.errors.dateSold}
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
                                    error={this.state.errors.customerId != null}
                                    value={this.state.item.customerId}
                                    onChange={this.changeHandler}
                                    options={this.props.customerOptions}
                                />
                                {this.state.errors.customerId
                                    ? <Label pointing prompt>{this.state.errors.customerId}</Label>
                                    :null}
                            </Form.Field>
                            <Form.Field>
                                <label>Product</label>
                                <Dropdown
                                    placeholder='--Select--'
                                    name="productId"
                                    fluid
                                    search
                                    selection
                                    error={this.state.errors.productId!=null}
                                    value={this.state.item.productId}
                                    onChange={this.changeHandler}
                                    options={this.props.productOptions}
                                />
                                {this.state.errors.productId
                                    ? <Label pointing prompt>{this.state.errors.productId}</Label>
                                    : null}
                            </Form.Field>
                            <Form.Field>
                                <label>Store</label>
                                <Dropdown
                                    placeholder='--Select--'
                                    name="storeId"
                                    fluid
                                    search
                                    selection
                                    error={this.state.errors.storeId!=null}
                                    value={this.state.item.storeId}
                                    onChange={this.changeHandler}
                                    options={this.props.storeOptions}
                                />
                                {this.state.errors.storeId
                                    ? <Label pointing prompt>{this.state.errors.storeId}</Label>
                                    : null}
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