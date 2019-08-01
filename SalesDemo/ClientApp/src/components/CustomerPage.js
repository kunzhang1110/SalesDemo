import React, { Component } from 'react';
import { Modal, Header, Image, Button, Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CustomerForm } from './CustomerForm';
import { DeleteConfirm } from './DeleteConfirm';
import axios from 'axios'

export class CustomerPage extends Component {

    constructor(props) {
        super(props);
        this.state = { customers: [] };
        this.getCustomers();
    }

    getCustomers = () => {
        fetch('/api/Customer')
            .then(
                response => response.json())
            .then(data => {
                this.setState({ customers: data });
            });
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

    editHandler = (edittedCustomer)=> {
        const customers = this.state.customers.map(c => {
            if (c.id == edittedCustomer.id) {
                c = edittedCustomer;
            }
            return c;
        });
        console.log(customers)
        this.setState({ customers });

    }

    createHandler = (createdCustomer) => {
        this.setState({ customers: [...this.state.customers, createdCustomer] })
    }

    deleteHandler = (id) => {
        const customers = this.state.customers.filter(c => c.id != id);
        this.setState({ customers });
    }

    renderCustomerTable(customers) {
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
                        customers.map(c => (
                            <Table.Row key={c.id}>
                                <Table.Cell>{c.name}</Table.Cell>
                                <Table.Cell>{c.address}</Table.Cell>
                                <Table.Cell>
                                    <CustomerForm customer={c} editHandler={this.editHandler}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <DeleteConfirm customer={c} deleteHandler={this.deleteHandler} />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>

            </Table>
        );
    }

    render() {
        return (
            <div>
                <CustomerForm createHandler={this.createHandler}/>
                {this.renderCustomerTable(this.state.customers)}
            </div>
        );
    }
}
