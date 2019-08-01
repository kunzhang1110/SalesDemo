import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Header, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';

export class DeleteConfirm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            customer: (this.props.customer != null) ? this.props.customer : { name: "", adress: "" }
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    cancelHandler = () => {
        this.setState({ customer: this.props.customer, modalOpen: false });
    }

    confirmHandler = (e) => {

        axios.delete('/api/Customer/' + this.state.customer.id).then((res) => {
            this.handleClose();
            this.props.deleteHandler(this.state.customer.id);
        })

    }

    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen}> Delete </Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>Delete XXX </Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <Header>Are you sure?</Header>


                        <Button onClick={this.cancelHandler}>Cancel</Button>
                        <Button onClick={this.confirmHandler} color="red">Delete</Button>

                    </Modal.Description>

                </Modal.Content>

            </Modal>
        );
    }
}

DeleteConfirm.propTypes = {
    deleteHandler: PropTypes.func
}