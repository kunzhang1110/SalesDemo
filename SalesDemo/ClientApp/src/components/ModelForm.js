import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, Icon } from 'semantic-ui-react'
import axios from 'axios';
import { Capitalize } from "../utils"

export class ModelForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            item: Object.assign({}, props.item),
            errors: {}
        }
    }

    setItemToEmpty = () => {
        let blankItem = {};
        Object.keys(this.props.item).map(name => {//clear item values
            blankItem[name] = "";
        });
        this.setState({ item: blankItem, modalOpen: false });
    }

    componentDidMount() {
        if (this.props.isEdit === false) {
            this.setItemToEmpty();
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    cancelHandler = () => {
        if (this.props.isEdit == false) {
            this.setItemToEmpty();
        } else {
            this.setState({ item: this.props.item, modalOpen: false });
        }
    }

    validate = () => {
        const errors = {};
        Object.keys(this.state.item).map(key => {
            if (key !== "id" && key !== "sale") {
                if (this.state.item[key].trim() === "") {
                    errors[key] = `${Capitalize(key)} is required.`;
                }
            }
            if (key === "price") {
                if (isNaN(this.state.item[key])) {
                    errors[key] = `Invalid number`;
                }
            }
        })
        return Object.keys(errors).length === 0 ? null : errors;

    }

    submitHandler = (e) => {
        e.preventDefault();

        let errors = this.validate();
        if (errors) {
            this.setState({ errors });
            return;
        }

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
        const { isEdit } = this.props;
        return (
            <Modal
                trigger={isEdit
                    ? <Button onClick={this.handleOpen} color='yellow'><Icon name='edit' />Edit</Button>
                    : <Button primary onClick={this.handleOpen}>{"New " + this.props.model}</Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>{((this.props.isEdit) ? "Edit " : "Create ") + this.props.model}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form onSubmit={this.submitHandler}>
                            {Object.keys(this.state.item).map(name => {
                                if (!name.includes("Id") && name !== "sale" && name !== "id") {
                                    return (
                                        <Form.Field key={name}>
                                            <label>{Capitalize(name)}</label>
                                            <Form.Input
                                                error={this.state.errors[name]}
                                                name={name}
                                                value={this.state.item[name]}
                                                onChange={this.changeHandler} />
                                        </Form.Field>
                                    )
                                }
                                return;
                            })}

                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.cancelHandler}>Cancel</Button>
                    <Button onClick={this.submitHandler} type='submit' color="green" icon labelPosition='right'>{isEdit ? "Edit" : "Create"} < Icon name='check' /></Button>
                </Modal.Actions>
            </Modal>

        );
    }
}

ModelForm.propTypes = {
    item: PropTypes.object,
    editHandler: PropTypes.func,
    isEdit: PropTypes.bool,
    model: PropTypes.string
}