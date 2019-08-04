import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { ModalForm } from './ModalForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";

export class ModelPage extends Component {

    constructor(props) {
        super(props);
        this.state = { dataSet: [] };
    }

    getData = () => {
        fetch('/api/' + this.props.model)
            .then(
                response => response.json())
            .then(data => {
                this.setState({ dataSet: data });
            });

    }

    componentDidMount() {

        this.getData();
    }

    //submitHandler = (e, customer, isEdit) => {
    //    if (isEdit) {
    //        axios.put('/api/Customer/' + customer.id, {
    //            name: customer.name,
    //            address: customer.address
    //        }).then(resp => { })

    //    }

    //    axios.post('/api/Customer', {
    //        name: this.state.customer.name,
    //        address: this.state.customer.address
    //    }).then((res) => {
    //        this.handleClose();
    //    })
    //}

    editHandler = (edittedItem) => {
        const dataSet = this.state.dataSet.map(c => {
            return (c.id === edittedItem.id) ? edittedItem:c;
        });
        this.setState({ dataSet });
    }

    createHandler = (createdItem) => {
        this.setState({ dataSet: [...this.state.dataSet, createdItem] })
    }

    deleteHandler = (id) => {
        const dataSet = this.state.dataSet.filter(c => c.id !== id);
        this.setState({ dataSet });
    }

    renderDataTable(dataSet) {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Adress</Table.HeaderCell>
                        <Table.HeaderCell>Edit</Table.HeaderCell>
                        <Table.HeaderCell>DELETE</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        dataSet.map(c => (
                            <Table.Row key={c.id}>
                                <Table.Cell>{c.name}</Table.Cell>
                                <Table.Cell>{c.address}</Table.Cell>
                                <Table.Cell>
                                    <ModalForm item={c} editHandler={this.editHandler} model={this.props.model} isEdit={true}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <DeleteConfirm item={c} model={this.props.model} deleteHandler={this.deleteHandler} />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>

            </Table>
        );
    }

    render() {
        //{ console.log(this.state.dataSet); debugger;}
        return (
            <div>
                {this.state.dataSet.length>0 ? <ModalForm createHandler={this.createHandler} model={this.props.model} isEdit={false} item={this.state.dataSet[0]} /> : null}
                {this.renderDataTable(this.state.dataSet)}
            </div>
        );
    }
}

ModelPage.propTypes = {
    model:PropTypes.string
}
