import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';
import { Capitalize } from "../utils"

export class ModalForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            item: Object.assign({},props.item),
        }
        if (props.isEdit === false) {
            this.setItemToEmpty();
        }
   
    }

    setItemToEmpty = () => {
  
        Object.keys(this.props.item).map(name => {//clear item values
            this.state.item[name] = "";
        });
        
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

    submitHandler = (e) => {
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
                            {Object.keys(this.state.item).map(name => {
                                if (!name.includes("Id") && name !== "sale" && name!=="id") {
                                    return (
                                        <Form.Field key={name}>
                                            <label>{Capitalize(name)}</label>
                                            <Form.Input
                                                name={name}
                                                value={this.state.item[name]}
                                                onChange={this.changeHandler} />
                                        </Form.Field>
                                    )
                                }
                                return;
                            })}
                            <Button type='submit' color="green">Submit</Button>
                            <Button onClick={this.cancelHandler}>Cancel</Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        );
    }
}

ModalForm.propTypes = {
    item: PropTypes.object,
    editHandler: PropTypes.func,
    isEdit: PropTypes.bool,
    model: PropTypes.string
}