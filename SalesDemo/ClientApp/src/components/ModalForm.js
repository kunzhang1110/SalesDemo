import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';
import { Capitalize } from "../utils"

export class ModalForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            isEdit: (this.props.item != null) ? true : false,
            item: (this.props.item != null) ? this.props.item : { name: "", adress: "" }
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    componentDidMount() {

    }

    cancelHandler = () => {
        this.setState({ item: this.props.item, modalOpen: false });
    }

    submitHandler = (e) => {
        if (this.state.isEdit) {//if editing
            axios.put('/api/'+this.props.model+'/' + this.state.item.id, {
                name: this.state.item.name,
                address: this.state.item.address
            }).then((res) => {
                this.handleClose();
                this.props.editHandler(this.state.item);
            })
        } else {//if creating
            axios.post('/api/' + this.props.model, {
                name: this.state.item.name,
                address: this.state.item.address
            }).then((res) => {

                this.handleClose();
                this.props.createHandler(res.data);
            })
        }
    }

    changeHandler = (e, { name, value }) => {
        this.setState({ item: { ...this.state.item, [name]: value } })
    }

    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen}> {(this.state.isEdit) ? "Edit" : "New " +this.props.model} </Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>{((this.state.isEdit) ? "Edit " : "Create ") + this.props.model}</Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <Header></Header>
                        <Form onSubmit={this.submitHandler}>
                            {Object.keys(this.state.item).map(name => {
                                if (name != "id" && name != "sale") {
                                    return (
                                        <Form.Field>
                                            <label>{Capitalize(name)}</label>
                                            <Form.Input
                                                placeholder='Jone'
                                                name={name}
                                                value={this.state.item[name]}
                                                onChange={this.changeHandler} />
                                        </Form.Field>
                                    )
                                }
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
    editHandler: PropTypes.func
}