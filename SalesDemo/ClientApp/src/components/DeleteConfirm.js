import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Header, Modal, Icon } from 'semantic-ui-react'
import axios from 'axios';

export class DeleteConfirm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            item: (this.props.item != null) ? this.props.item : {}
        }
    }

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    cancelHandler = () => {
        this.setState({ item: this.props.item, modalOpen: false });
    }

    confirmHandler = (e) => {

        axios.delete('/api/' + this.props.model + '/' + this.state.item.id).then((res) => {
            this.handleClose();
            this.props.deleteHandler(this.state.item.id);
        })

    }

    render() {
        return (
            <Modal
                trigger={<Button onClick={this.handleOpen} color='red'><Icon name="trash" />Delete</Button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>Delete {this.props.model} </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Are you sure?</Header>
                    </Modal.Description>

                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.cancelHandler} >Cancel</Button>
                    <Button onClick={this.confirmHandler} color="red" icon labelPosition='right' >Delete<Icon name='delete' /></Button>
                </Modal.Actions>

            </Modal>
        );
    }
}

DeleteConfirm.propTypes = {
    deleteHandler: PropTypes.func,
    model: PropTypes.string,
    item: PropTypes.object
}